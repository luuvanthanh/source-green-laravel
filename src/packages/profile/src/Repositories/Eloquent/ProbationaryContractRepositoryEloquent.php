<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use Exception;
use GGPHP\Category\Models\ParamaterValue;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Profile\Presenters\ProbationaryContractPresenter;
use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use GGPHP\Profile\Repositories\Contracts\ProbationaryContractRepository;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Facades\Storage;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProbationaryContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ProbationaryContractRepositoryEloquent extends CoreRepositoryEloquent implements ProbationaryContractRepository
{
    const TI_LE_THU_VIEC = 'TI_LE_THU_VIEC';

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'employee.FullName' => 'like',
        'CreationTime',
    ];

    /**
     * @param Application $app
     * @param ExcelExporterServices $wordExporterServices
     */
    public function __construct(
        WordExporterServices $wordExporterServices,
        PositionLevelRepositoryEloquent $positionLevelRepository,
        ScheduleRepositoryEloquent $scheduleRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->positionLevelRepository = $positionLevelRepository;
        $this->wordExporterServices = $wordExporterServices;
        $this->scheduleRepositoryEloquent = $scheduleRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ProbationaryContract::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ProbationaryContractPresenter::class;
    }

    public function getProbationaryContract(array $attributes)
    {
        if (!empty($attributes['status'])) {

            switch ($attributes['status']) {
                case 'DANG_HIEU_LUC':
                    $now = Carbon::now();
                    $addMonth = Carbon::now()->addMonth();

                    $this->model = $this->model->where('ContractFrom', '<=', $now->format('Y-m-d'))->where('ContractTo', '>', $addMonth->format('Y-m-d'));
                    break;
                case 'GAN_HET_HAN':
                    $now = Carbon::now();
                    $addMonth = Carbon::now()->addWeeks();

                    $this->model = $this->model->where('ContractTo', '>=', $now->format('Y-m-d'))->where('ContractTo', '<=', $addMonth->format('Y-m-d'));
                    break;
                case 'DA_HET_HAN':
                    $now = Carbon::now();

                    $this->model = $this->model->where('ContractTo', '<', $now->format('Y-m-d'));
                    break;
                case 'CHUA_DEN_HAN':
                    $now = Carbon::now();

                    $this->model = $this->model->where('ContractFrom', '>', $now->format('Y-m-d'));
                    break;
                default:
                    break;
            }
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['typeOfContractId'])) {
            $typeOfContractId = explode(',', $attributes['typeOfContractId']);
            $this->model = $this->model->whereIn('TypeOfContractId', $typeOfContractId);
        }

        if (!empty($attributes['branchId'])) {
            $branchId = explode(',', $attributes['branchId']);
            $this->model = $this->model->whereIn('BranchId', $branchId);
        }

        if (!empty($attributes['positionId'])) {
            $positionId = explode(',', $attributes['positionId']);
            $this->model = $this->model->whereIn('PositionId', $positionId);
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('ContractDate', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))->where('ContractDate', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'));
        }

        if (!empty($attributes['limit'])) {
            $probationaryContract = $this->paginate($attributes['limit']);
        } else {
            $probationaryContract = $this->get();
        }

        return $probationaryContract;
    }

    public function create(array $attributes)
    {

        \DB::beginTransaction();
        try {
            $probationaryContract = ProbationaryContract::create($attributes);

            resolve(LabourContractRepository::class)->created($probationaryContract, $attributes);
            $totalAllowance = 0;
            $basicSalary = 0;

            foreach ($attributes['detail'] as $value) {
                $parameterValue = ParamaterValue::find($value['parameterValueId']);

                if ($parameterValue->Code != 'LUONG_CB') {
                    if ($parameterValue->Code != self::TI_LE_THU_VIEC) {
                        $totalAllowance += $value['value'];
                    } else {
                        $salaryRatio = $value['value'] < 1 ? $value['value'] * 100 : $value['value'];
                    }
                } else {
                    $basicSalary = $value['value'];
                }

                $probationaryContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            $probationaryContract->update([
                'TotalAllowance' => $totalAllowance,
                'BasicSalary' => $basicSalary,
                'SalaryRatio' => isset($salaryRatio) ? $salaryRatio : null
            ]);
            $probationaryContract->employee->update(['DateOff' => null]);

            $dataPosition = [
                'employeeId' => $attributes['employeeId'],
                'branchId' => $attributes['branchId'],
                'positionId' => $attributes['positionId'],
                'divisionId' => $attributes['divisionId'],
                'startDate' => $probationaryContract->ContractFrom->format('Y-m-d'),
                'type' => 'PROBATION',
                'ModelId' => $probationaryContract->Id,
                'ModelType' => ProbationaryContract::class,
            ];

            $this->positionLevelRepository->create($dataPosition);

            $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $attributes['divisionId'])->where([['StartDate', '<=', $probationaryContract->ContractFrom->format('Y-m-d')], ['EndDate', '>=', $probationaryContract->ContractFrom->format('Y-m-d')]])->first();

            if (!is_null($divisionShift)) {
                $dataSchedule = [
                    'employeeId' => $attributes['employeeId'],
                    'shiftId' => $divisionShift->ShiftId,
                    'startDate' => $probationaryContract->ContractFrom->format('Y-m-d'),
                    'endDate' => $probationaryContract->ContractTo->format('Y-m-d'),
                    'interval' => 1,
                    'repeatBy' => 'daily',
                ];

                $this->scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
            }


            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new Exception($e->getMessage(), $e->getCode());
        }

        return parent::find($probationaryContract->Id);
    }

    public function update(array $attributes, $id)
    {

        $probationaryContract = ProbationaryContract::findOrFail($id);
        \DB::beginTransaction();
        try {
            $probationaryContract->update($attributes);

            resolve(LabourContractRepository::class)->updated($probationaryContract->refresh(), $attributes);

            $probationaryContract->parameterValues()->detach();

            $totalAllowance = 0;
            $basicSalary = 0;

            foreach ($attributes['detail'] as $value) {
                $parameterValue = ParamaterValue::find($value['parameterValueId']);

                if ($parameterValue->Code != 'LUONG_CB') {
                    if ($parameterValue->Code != self::TI_LE_THU_VIEC) {
                        $totalAllowance += $value['value'];
                    } else {
                        $salaryRatio = $value['value'] < 1 ? $value['value'] * 100 : $value['value'];
                    }
                } else {
                    $basicSalary = $value['value'];
                }

                $probationaryContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            $probationaryContract->update([
                'TotalAllowance' => $totalAllowance,
                'BasicSalary' => $basicSalary,
                'SalaryRatio' => isset($salaryRatio) ? $salaryRatio : null
            ]);

            $positionLevel = $probationaryContract->positionLevel;
            $dataPosition = [
                'employeeId' => $probationaryContract->EmployeeId,
                'branchId' => $probationaryContract->BranchId,
                'positionId' => $probationaryContract->PositionId,
                'divisionId' => $probationaryContract->DivisionId,
                'startDate' => $probationaryContract->ContractFrom->format('Y-m-d'),
                'type' => 'PROBATION',
                'ModelId' => $probationaryContract->Id,
                'ModelType' => ProbationaryContract::class,
            ];

            if (!is_null($positionLevel)) {
                $this->positionLevelRepository->update($dataPosition, $positionLevel->Id);
            } else {
                $this->positionLevelRepository->create($dataPosition);
            }


            $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $probationaryContract->DivisionId)->where([['StartDate', '<=', $probationaryContract->ContractFrom->format('Y-m-d')], ['EndDate', '>=', $probationaryContract->ContractFrom->format('Y-m-d')]])->first();

            if (!is_null($divisionShift)) {
                $dataSchedule = [
                    'employeeId' => $attributes['employeeId'],
                    'shiftId' => $divisionShift->ShiftId,
                    'startDate' => $probationaryContract->ContractFrom->format('Y-m-d'),
                    'endDate' => $probationaryContract->ContractTo->format('Y-m-d'),
                    'interval' => 1,
                    'repeatBy' => 'daily',
                ];

                $this->scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new Exception($e->getMessage(), $e->getCode());
        }

        return parent::find($probationaryContract->Id);
    }

    public function delete($id)
    {
        $probationaryContract = ProbationaryContract::findOrFail($id);

        $probationaryContract->parameterValues()->detach();

        return $probationaryContract->delete();
    }
    public function exportWord($id, $response = null)
    {
        $labourContract = ProbationaryContract::findOrFail($id);
        $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;

        if ($labourContract->SalaryRatio) {
            $salaryRatio = $labourContract->SalaryRatio;
        } else {
            $probationRate = $labourContract->parameterValues()->where('Code', self::TI_LE_THU_VIEC)->first();

            if ($probationRate) {
                $salaryRatio  = $probationRate->ValueDefault < 1 ? $probationRate->ValueDefault * 100 : $probationRate->ValueDefault;
            }
        }

        $salary = $labourContract->BasicSalary;
        $allowance =  $labourContract->TotalAllowance;

        // Lương thực nhận
        // $probationSalary = isset($salaryRatio) ? $salary * $salaryRatio / 100 : $salary;
        $represent = $labourContract->represent;

        if (is_null($represent)) {
            $positionRepresent = '';
        } else {
            $positionRepresent = $represent->positionLevelNow ? $represent->positionLevelNow->position->Name : '';
        }

        $total = $salary + $allowance;
        $employee = $labourContract->employee;

        $params = [
            'contractNumber' => $contractNumber,
            'dateNow' => $labourContract->ContractDate->format('d'),
            'monthNow' => $labourContract->ContractDate->format('m'),
            'yearNow' => $labourContract->ContractDate->format('Y'),
            'adressCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Address : '........',
            'phoneCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->PhoneNumber : '........',
            'represent' => !is_null($represent) ? $represent->FullName : '',
            'position' =>  $positionRepresent,
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'birthday' => $employee->DateOfBirth ? $employee->DateOfBirth->format('d-m-Y') : '........',
            'placeOfBirth' => $employee->PlaceOfBirth ? $employee->PlaceOfBirth : '........',
            'nationality' => $employee->Nationality ? $employee->Nationality : '........',
            'idCard' => $employee->IdCard ? $employee->IdCard : '........',
            'dateOfIssueCard' => $employee->DateOfIssueIdCard ? $employee->DateOfIssueIdCard->format('d-m-Y') : '........',
            'placeOfIssueCard' => $employee->PlaceOfIssueIdCard ? ($employee->PlaceOfIssueIdCard) : '........',
            'permanentAddress' => $employee->PermanentAddress ? $employee->PermanentAddress : '........',
            'adress' => $employee->Address ? $employee->Address : '.......',
            'phone' => $employee->PhoneNumber ? $employee->PhoneNumber : '.......',
            'typeContract' => $labourContract->typeOfContract ? $labourContract->typeOfContract->Name : '........',
            'month' => $labourContract->Month ? $labourContract->Month : '........',
            'salaryRatio' => isset($salaryRatio) ? $salaryRatio : '........',
            'from' => $labourContract->ContractFrom ? $labourContract->ContractFrom->format('d-m-Y') : '........',
            'to' => $labourContract->ContractTo ? $labourContract->ContractTo->format('d-m-Y') : '........',
            'positionDivision' => $labourContract->position && $labourContract->division ? $labourContract->position->Name . ' - ' . $labourContract->division->Name : '........',
            'branchWord' => $labourContract->branch ? $labourContract->branch->Address : '........',
            'workTime' => $labourContract->WorkTime ? $labourContract->WorkTime : '.......',
            'salary' => number_format($salary),
            'allowance' => number_format($allowance),
            'total' => number_format($total),
            'base' => $labourContract->IsAuthority ? '-	    Căn cứ giấy ủy quyền ngày 17-08-2020 về việc ủy quyền ký hồ sơ đã được Giám đốc điều hành ủy quyền cho bà Nguyễn Thị Hồng An' : ''
        ];

        return $this->wordExporterServices->exportWord('probationary_contract', $params, $response);
    }

    public function exportWordEnglish($id)
    {
        $labourContract = ProbationaryContract::findOrFail($id);
        $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;

        $employee = $labourContract->employee;
        $params = [
            'typeVn' => 'THỬ VIỆC',
            'typeEnglish' => 'PROBATIONARY',
            'contractNumber' => $contractNumber,
            'dateNow' => $labourContract->ContractDate->format('d'),
            'monthNow' => $labourContract->ContractDate->format('m'),
            'yearNow' => $labourContract->ContractDate->format('Y'),
            'adressCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Address : '........',
            'phoneCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->PhoneNumber : '........',
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'birthday' => $employee->DateOfBirth ? $employee->DateOfBirth->format('d-m-Y') : '........',
            'placeOfBirth' => $employee->PlaceOfBirth ? $employee->PlaceOfBirth : '........',
            'nationality' => $employee->Nationality ? $employee->Nationality : '........',
            'idCard' => $employee->IdCard ? $employee->IdCard : '........',
            'dateOfIssueCard' => $employee->DateOfIssueIdCard ? $employee->DateOfIssueIdCard->format('d-m-Y') : '........',
            'placeOfIssueCard' => $employee->PlaceOfIssueIdCard ? $employee->PlaceOfIssueIdCard : '........',
            'permanentAddress' => $employee->PermanentAddress ? $employee->PermanentAddress : '........',
            'adress' => $employee->Address ? $employee->Address : '.......',
            'phone' => $employee->PhoneNumber ? $employee->PhoneNumber : '.......',
            'typeContract' => $labourContract->typeOfContract ? $labourContract->typeOfContract->Name : '........',
            'from' => $labourContract->ContractFrom ? $labourContract->ContractFrom->format('d-m-Y') : '........',
            'to' => $labourContract->ContractTo ? $labourContract->ContractTo->format('d-m-Y') : '........',
            'position' => $labourContract->position ? $labourContract->position->Name : '........',
            'branchWord' => $labourContract->branch ? $labourContract->branch->Name : '........',
            'workTime' => $labourContract->WorkTime ? $labourContract->WorkTime : '.......',
            'salary' => number_format($labourContract->BasicSalary),
        ];

        return $this->wordExporterServices->exportWord('contract_english', $params);
    }

    public function exportWordAuthority($id)
    {
        $labourContract = ProbationaryContract::findOrFail($id);
        $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;

        $employee = $labourContract->employee;
        $params = [
            'typeVn' => 'THỬ VIỆC',
            'typeEnglish' => 'PROBATIONARY',
            'contractNumber' => $contractNumber,
            'dateNow' => $labourContract->ContractDate->format('d'),
            'monthNow' => $labourContract->ContractDate->format('m'),
            'yearNow' => $labourContract->ContractDate->format('Y'),
            'adressCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Address : '........',
            'phoneCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->PhoneNumber : '........',
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'birthday' => $employee->DateOfBirth ? $employee->DateOfBirth->format('d-m-Y') : '........',
            'placeOfBirth' => $employee->PlaceOfBirth ? $employee->PlaceOfBirth : '........',
            'nationality' => $employee->Nationality ? $employee->Nationality : '........',
            'idCard' => $employee->IdCard ? $employee->IdCard : '........',
            'dateOfIssueCard' => $employee->DateOfIssueIdCard ? $employee->DateOfIssueIdCard->format('d-m-Y') : '........',
            'placeOfIssueCard' => $employee->PlaceOfIssueIdCard ? $employee->PlaceOfIssueIdCard : '........',
            'permanentAddress' => $employee->PermanentAddress ? $employee->PermanentAddress : '........',
            'adress' => $employee->Address ? $employee->Address : '.......',
            'phone' => $employee->PhoneNumber ? $employee->PhoneNumber : '.......',
            'typeContract' => $labourContract->typeOfContract ? $labourContract->typeOfContract->Name : '........',
            'from' => $labourContract->ContractFrom ? $labourContract->ContractFrom->format('d-m-Y') : '........',
            'to' => $labourContract->ContractTo ? $labourContract->ContractTo->format('d-m-Y') : '........',
            'position' => $labourContract->position ? $labourContract->position->Name : '........',
            'branchWord' => $labourContract->branch ? $labourContract->branch->Name : '........',
            'workTime' => $labourContract->WorkTime ? $labourContract->WorkTime : '.......',
            'salary' => number_format($labourContract->BasicSalary),
        ];

        return $this->wordExporterServices->exportWord('authority_contract', $params);
    }

    public function previewProbationaryContractExportWord($id)
    {
        $string = substr(uniqid(), 7);
        $probationaryContract = ProbationaryContract::findOrFail($id);
        $fileName = $probationaryContract->Id . $string . '.docx';
        $filePath = $this->exportWord($id, 'url');
        $file = Storage::disk('local')->get($filePath);

        Storage::disk('local')->put('public/files/' . $fileName, $file);

        return [
            'data' => [
                'url' => env('URL_FILE') . $fileName
            ]
        ];
    }
}
