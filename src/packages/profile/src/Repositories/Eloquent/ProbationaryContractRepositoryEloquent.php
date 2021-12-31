<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Category\Models\ParamaterValue;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Profile\Presenters\ProbationaryContractPresenter;
use GGPHP\Profile\Repositories\Contracts\ProbationaryContractRepository;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProbationaryContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ProbationaryContractRepositoryEloquent extends CoreRepositoryEloquent implements ProbationaryContractRepository
{

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
            $totalAllowance = 0;
            $basicSalary = 0;

            foreach ($attributes['detail'] as $value) {
                $parameterValue = ParamaterValue::find($value['parameterValueId']);

                if ($parameterValue->Code != 'LUONG_CB') {
                    $totalAllowance += $value['value'];
                } else {
                    $basicSalary = $value['value'];
                }

                $probationaryContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            $probationaryContract->update([
                'TotalAllowance' => $totalAllowance,
                'BasicSalary' => $basicSalary
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
        }

        return parent::find($probationaryContract->Id);
    }

    public function update(array $attributes, $id)
    {
        $probationaryContract = ProbationaryContract::findOrFail($id);

        \DB::beginTransaction();
        try {
            $probationaryContract->update($attributes);

            $probationaryContract->parameterValues()->detach();

            $totalAllowance = 0;
            $basicSalary = 0;

            foreach ($attributes['detail'] as $value) {
                $parameterValue = ParamaterValue::find($value['parameterValueId']);

                if ($parameterValue->Code != 'LUONG_CB') {
                    $totalAllowance += $value['value'];
                } else {
                    $basicSalary = $value['value'];
                }

                $probationaryContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            $probationaryContract->update([
                'TotalAllowance' => $totalAllowance,
                'BasicSalary' => $basicSalary
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
        }

        return parent::find($probationaryContract->Id);
    }

    public function exportWord($id)
    {
        $labourContract = ProbationaryContract::findOrFail($id);
        $now = Carbon::now();

        $salary = $labourContract->BasicSalary;
        $allowance =  $labourContract->TotalAllowance;

        $total = $salary + $allowance;
        $employee = $labourContract->employee;
        $params = [
            'contractNumber' => $labourContract->ContractNumber,
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
            'placeOfIssueCard' => $employee->PlaceOfIssueIdCard ? ($employee->PlaceOfIssueIdCard) : '........',
            'permanentAddress' => $employee->PermanentAddress ? $employee->PermanentAddress : '........',
            'adress' => $employee->Address ? $employee->Address : '.......',
            // 'phone' => $employee->Phone ? $employee->Phone : '.......',
            'typeContract' => $labourContract->typeOfContract ? $labourContract->typeOfContract->Name : '........',
            'month' => $labourContract->Month ? $labourContract->Month : '........',
            'salaryRatio' => $labourContract->SalaryRatio ? $labourContract->SalaryRatio : '........',
            'from' => $labourContract->ContractFrom ? $labourContract->ContractFrom->format('d-m-Y') : '........',
            'to' => $labourContract->ContractTo ? $labourContract->ContractTo->format('d-m-Y') : '........',
            'positionDivision' => $labourContract->position && $labourContract->division ? $labourContract->position->Name . ' - ' . $labourContract->division->Name : '........',
            'branchWord' => $labourContract->branch ? $labourContract->branch->Address : '........',
            'workTime' => $labourContract->WorkTime ? $labourContract->WorkTime : '.......',
            'salary' => number_format($salary),
            'allowance' => number_format($allowance),
            'total' => number_format($total),
        ];

        return $this->wordExporterServices->exportWord('probationary_contract', $params);
    }

    public function delete($id)
    {
        $probationaryContract = ProbationaryContract::findOrFail($id);

        $probationaryContract->parameterValues()->detach();

        return $probationaryContract->delete();
    }
}
