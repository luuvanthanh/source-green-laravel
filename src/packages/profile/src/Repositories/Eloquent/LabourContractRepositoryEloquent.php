<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\ParamaterValue;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\NumberFormContract;
use GGPHP\Profile\Presenters\LabourContractPresenter;
use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Users\Models\User;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Exception;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Support\Facades\Storage;

/**
 * Class LabourContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class LabourContractRepositoryEloquent extends CoreRepositoryEloquent implements LabourContractRepository
{
    protected $wordExporterServices;

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
        Application $app,
        ExcelExporterServices $excelExporterServices
    ) {
        parent::__construct($app);
        $this->positionLevelRepository = $positionLevelRepository;
        $this->wordExporterServices = $wordExporterServices;
        $this->scheduleRepositoryEloquent = $scheduleRepositoryEloquent;
        $this->excelExporterServices = $excelExporterServices;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return LabourContract::class;
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
        return LabourContractPresenter::class;
    }

    public function getLabourContract(array $attributes)
    {
        if (!empty($attributes['status'])) {

            switch ($attributes['status']) {
                case 'DANG_HIEU_LUC':
                    $now = Carbon::now();
                    $addMonth = Carbon::now()->addMonth();

                    $this->model = $this->model->where('ContractFrom', '<=', $now->format('Y-m-d'))->where('ContractTo', '>', $addMonth->format('Y-m-d'))
                        ->orWhereHas('typeOfContract', function ($query) {
                            $query->where('IsUnlimited', true);
                        });
                    break;
                case 'GAN_HET_HAN':
                    $now = Carbon::now();
                    $addMonth = Carbon::now()->addMonth();

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

        if (!empty($attributes['date'])) {
            $this->model = $this->model->where('ContractFrom', '<=', $attributes['date']);
        }

        if (isset($attributes['number_year_work_from']) && !empty($attributes['date'])) {
            $this->model = $this->model->where('ContractFrom', '<=', Carbon::parse($attributes['date'])->subYear($attributes['number_year_work_from'])->format('Y-m-d'));
        }

        if (isset($attributes['number_year_work_to']) && !empty($attributes['date'])) {
            $this->model = $this->model->where('ContractFrom', '>=', Carbon::parse($attributes['date'])->subYear($attributes['number_year_work_to'] + 1)->format('Y-m-d'));
        }

        if (!empty($attributes['limit'])) {
            $labourContract = $this->paginate($attributes['limit']);
        } else {
            $labourContract = $this->get();
        }

        return $labourContract;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $labourContract = LabourContract::create($attributes);

            $this->created($labourContract, $attributes);

            $totalAllowance = 0;
            $basicSalary = 0;

            foreach ($attributes['detail'] as $value) {
                $parameterValue = ParamaterValue::find($value['parameterValueId']);

                if ($parameterValue->Code != 'LUONG_CB') {
                    $totalAllowance += $value['value'];
                } else {
                    $basicSalary = $value['value'];
                }

                $labourContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            $labourContract->update([
                'TotalAllowance' => $totalAllowance,
                'BasicSalary' => $basicSalary
            ]);

            $dataPosition = [
                'employeeId' => $attributes['employeeId'],
                'branchId' => $attributes['branchId'],
                'positionId' => $attributes['positionId'],
                'divisionId' => $attributes['divisionId'],
                'startDate' => $labourContract->ContractFrom->format('Y-m-d'),
                'type' => 'LABOUR',
                'ModelId' => $labourContract->Id,
                'ModelType' => LabourContract::class,
            ];

            $labourContract->employee->update(['DateOff' => null]);
            $this->positionLevelRepository->create($dataPosition);

            $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $attributes['divisionId'])->where([['StartDate', '<=', $labourContract->ContractFrom->format('Y-m-d')], ['EndDate', '>=', $labourContract->ContractFrom->format('Y-m-d')]])->first();

            if (!is_null($divisionShift)) {

                $endDate = $labourContract->ContractTo ? $labourContract->ContractTo->format('Y-m-d') : $divisionShift->EndDate->format('Y-m-d');

                $dataSchedule = [
                    'employeeId' => $attributes['employeeId'],
                    'shiftId' => $divisionShift->ShiftId,
                    'startDate' => $labourContract->ContractFrom->format('Y-m-d'),
                    'endDate' => $endDate,
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

        return parent::find($labourContract->Id);
    }

    public function update(array $attributes, $id)
    {
        $labourContract = LabourContract::findOrFail($id);

        \DB::beginTransaction();
        try {
            $labourContract->update($attributes);

            $this->updated($labourContract->refresh(), $attributes);

            $labourContract->parameterValues()->detach();
            $totalAllowance = 0;
            $basicSalary = 0;

            foreach ($attributes['detail'] as $value) {
                $parameterValue = ParamaterValue::find($value['parameterValueId']);

                if ($parameterValue->Code != 'LUONG_CB') {
                    $totalAllowance += $value['value'];
                } else {
                    $basicSalary = $value['value'];
                }

                $labourContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            $labourContract->update([
                'TotalAllowance' => $totalAllowance,
                'BasicSalary' => $basicSalary
            ]);

            $positionLevel = $labourContract->positionLevel;
            $dataPosition = [
                'employeeId' => $labourContract->EmployeeId,
                'branchId' => $labourContract->BranchId,
                'positionId' => $labourContract->PositionId,
                'divisionId' => $labourContract->DivisionId,
                'startDate' => $labourContract->ContractFrom->format('Y-m-d'),
                'type' => 'LABOUR',
                'ModelId' => $labourContract->Id,
                'ModelType' => LabourContract::class,
            ];

            if (!is_null($positionLevel)) {
                $this->positionLevelRepository->update($dataPosition, $positionLevel->Id);
            } else {
                $this->positionLevelRepository->create($dataPosition);
            }

            $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $labourContract->DivisionId)->where([['StartDate', '<=', $labourContract->ContractFrom->format('Y-m-d')], ['EndDate', '>=', $labourContract->ContractFrom->format('Y-m-d')]])->first();

            if (!is_null($divisionShift)) {
                $dataSchedule = [
                    'employeeId' => $attributes['employeeId'],
                    'shiftId' => $divisionShift->ShiftId,
                    'startDate' => $labourContract->ContractFrom->format('Y-m-d'),
                    'endDate' => !is_null($labourContract->ContractTo) ? $labourContract->ContractTo->format('Y-m-d') : null,
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

        return parent::find($labourContract->Id);
    }

    public function exportWord($id, $response = null)
    {
        $labourContract = LabourContract::findOrFail($id);
        $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;

        $employee = $labourContract->employee;
        $params = [
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
            'base' => $labourContract->IsAuthority ? '-      Căn cứ giấy ủy quyền ngày 17-08-2020 về việc ủy quyền ký hồ sơ đã được Giám đốc điều hành ủy quyền cho bà Nguyễn Thị Hồng An' : ''
        ];

        return $this->wordExporterServices->exportWord('labour_contract', $params, $response);
    }

    public function exportWordEnglish($id, $response = null)
    {
        $labourContract = LabourContract::findOrFail($id);
        $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;

        $employee = $labourContract->employee;

        $represent = $labourContract->represent;
        if (is_null($represent)) {
            $nameSigner = $this->model()::SIGNER_DEFAULT;
            $positionRepresent = $this->model()::POSITION_DEFAULT;
        } else {
            $nameSigner = $represent->FullName;
            $positionRepresent = $represent->positionLevelNow ? $employee->positionLevelNow->position->Name : '........';
        }

        $params = [
            'typeVn' => 'LAO ĐỘNG',
            'typeEnglish' => 'LABOUR',
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
            'signer' => $nameSigner,
            'position' => $positionRepresent
        ];

        return $this->wordExporterServices->exportWord('contract_english', $params, $response);
    }

    public function exportWordAuthority($id, $response = null)
    {
        $labourContract = LabourContract::findOrFail($id);
        $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;

        $employee = $labourContract->employee;
        $params = [
            'typeVn' => 'LAO ĐỘNG',
            'typeEnglish' => 'LABOUR',
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
            'represent_name' => $labourContract->represent ? $labourContract->represent->FullName : '',
            'base' => $labourContract->IsAuthority ? '-      Căn cứ giấy ủy quyền ngày 17-08-2020 về việc ủy quyền ký hồ sơ đã được Giám đốc điều hành ủy quyền cho bà Nguyễn Thị Hồng An' : ''
        ];

        return $this->wordExporterServices->exportWord('authority_contract', $params, $response);
    }

    public function delete($id)
    {
        $labourContract = LabourContract::findOrFail($id);

        $labourContract->parameterValues()->detach();

        return $labourContract->delete();
    }

    public function reportWorkingSeniority($attributes, $parser = false)
    {
        $result = [];
        if (!empty($attributes['date'])) {
            $date = $attributes['date'];
            $this->model = $this->model->where('ContractFrom', '<=', $attributes['date']);
        }

        if (isset($attributes['number_year_work_from']) && !empty($attributes['date'])) {
            $this->model = $this->model->where('ContractFrom', '<=', Carbon::parse($attributes['date'])->subYear($attributes['number_year_work_from'])->format('Y-m-d'));
        }

        if (isset($attributes['number_year_work_to']) && !empty($attributes['date'])) {
            $this->model = $this->model->where('ContractFrom', '>=', Carbon::parse($attributes['date'])->subYear($attributes['number_year_work_to'] + 1)->format('Y-m-d'));
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['branchId'])) {
            $branchId = explode(',', $attributes['branchId']);
            $this->model = $this->model->whereIn('BranchId', $branchId);
        }

        $labourContracts = $this->model->get();
        $numberYearWork = 0;
        $numberMonthWork = 0;

        foreach ($labourContracts as $labourContract) {
            $employeeId = is_null($labourContract->employee) ? '' : $labourContract->employee->Id;
            $resignationDecision = $labourContract->employee->resignationDecision;
            if (is_null($resignationDecision)) {
                if (!array_key_exists($employeeId, $result)) {
                    if (!is_null($date)) {
                        $date = Carbon::parse($date);
                        $quantityWorking = $labourContract->ContractFrom->diff($date);
                        $numberMonthWork = $quantityWorking->m;
                        $numberYearWork = $quantityWorking->y;
                    }
                    $result[$employeeId] =  [
                        'employeeId' => $employeeId,
                        'employeeCode' => is_null($labourContract->employee) ? '' : $labourContract->employee->Code,
                        'employeeName' => is_null($labourContract->employee) ? '' : $labourContract->employee->FullName,
                        'position' => is_null($labourContract->position) ? '' : $labourContract->position->Name,
                        'branch' => is_null($labourContract->branch) ? '' : $labourContract->branch->Name,
                        'contractFrom' => $labourContract->ContractFrom->format('Y-m-d'),
                        'numberYearWork' => $numberYearWork,
                        'numberMonthWork' => $numberMonthWork,
                    ];
                } else {
                    if ($labourContract->ContractFrom->format('Ymd') < Carbon::parse($result[$employeeId]['contractFrom'])->format('Ymd')) {
                        if (!is_null($date)) {
                            $date = Carbon::parse($date);
                            $quantityWorking = $labourContract->ContractFrom->diff($date);
                            $numberMonthWork = $quantityWorking->m;
                            $numberYearWork = $quantityWorking->y;
                        }
                        $result[$employeeId]['employeeId'] =  $employeeId;
                        $result[$employeeId]['employeeCode'] =  is_null($labourContract->employee) ? '' : $labourContract->employee->Code;
                        $result[$employeeId]['employeeName'] =  is_null($labourContract->employee) ? '' : $labourContract->employee->FullName;
                        $result[$employeeId]['position'] =  is_null($labourContract->position) ? '' : $labourContract->position->Name;
                        $result[$employeeId]['branch'] =  is_null($labourContract->branch) ? '' : $labourContract->branch->Name;
                        $result[$employeeId]['contractFrom'] =  $labourContract->ContractFrom->format('Y-m-d');
                        $result[$employeeId]['numberYearWork'] =  $numberYearWork;
                        $result[$employeeId]['numberMonthWork'] =  $numberMonthWork;
                    }
                }
            }
        }

        $limit = 2;
        $page = 1;
        if (!empty($attributes['limit'])) {
            $limit = $attributes['limit'];
        }

        if (!empty($attributes['page'])) {
            $page = $attributes['page'];
        }

        if ($parser) {
            return $result;
        }

        $result = $this->paginateCollection($result, $limit, $page);
        return $result;
    }

    public function paginateCollection($items, $perPage = 2, $page = null, $options = [])
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?: 1);
        $items = $items instanceof Collection ? $items : Collection::make($items);

        $result = new LengthAwarePaginator($items->forPage($page, $perPage), $items->count(), $perPage, $page, $options);
        $result->setPath(request()->url());

        return $result;
    }

    public function exportExcelWorkingSeniority($attributes)
    {
        $workingSeniority = $this->reportWorkingSeniority($attributes, true);

        $branch = null;
        if (!empty($attributes['branchId'])) {
            $branch = Branch::where('Id', $attributes['branchId'])->first();
        }

        $employee = null;
        if (!empty($attributes['employeeId'])) {
            $employee = User::where('Id', $attributes['employeeId'])->first();
        }

        $params['{time}'] = Carbon::parse($attributes['date'])->format('d/m/Y');
        $params['{branch_name}'] = is_null($branch) ? '--Tất cả--' : $branch->Name;
        $params['{number_year_work_from}'] = isset($attributes['number_year_work_from']) ? $attributes['number_year_work_from'] . ' ' . 'năm' : '';
        $params['{number_year_work_to}'] = isset($attributes['number_year_work_to']) ? $attributes['number_year_work_to'] . ' ' . 'năm' : '';
        $params['{employee}'] = is_null($employee) ? '--Tất cả--' : $employee->FullName;
        $number = 0;
        foreach ($workingSeniority as $key => $value) {
            $params['[number]'][] = $number += 1;
            $params['[code]'][] = $value['employeeCode'];
            $params['[fullName]'][] = $value['employeeName'];
            $params['[position]'][] = $value['position'];
            $params['[branch]'][] = $value['branch'];
            $params['[contractFrom]'][] = Carbon::parse($value['contractFrom'])->format('d/m/Y');
            $params['[numberYearWork]'][] = $value['numberYearWork'];
            $params['[numberMonthWork]'][] = $value['numberMonthWork'];
        }

        return $this->excelExporterServices->export('work_seniority', $params);
    }

    public function created($model, $attributes)
    {
        $numberFormContract = NumberFormContract::findOrFail($attributes['numberFormContractId']);

        $numberFormContract->update(['OrdinalNumber' => $model->OrdinalNumber]);
    }

    public function updated($model, $attributes)
    {
        $typeContract = NumberFormContract::TYPE[$attributes['type']];
        $numberFormContract = NumberFormContract::whereDate('StartDate', '<=', $model->ContractDate)
            ->whereDate('EndDate', '>=', $model->ContractDate)
            ->where('Type', $typeContract)->first();

        if (!$numberFormContract) {
            return null;
        }

        if (!is_null($model->OrdinalNumber)) {
            $numberFormContract->update(['OrdinalNumber' => $model->OrdinalNumber]);
        }
    }

    public function contractAddendum($id, $response = null)
    {
        $contract = $this->model->find($id);

        $employee = resolve(UserRepository::class)->skipPresenter()->find($contract->EmployeeId);

        $represent = $contract->represent;

        if (is_null($represent)) {
            $positionRepresent = '';
        } else {
            $positionRepresent = $represent->positionLevelNow ? $represent->positionLevelNow->position->Name : '';
        }

        $liabilityAllowance = 0;
        $parameterValues = $contract->parameterValues;

        if (!empty($parameterValues)) {
            $liabilityAllowance = $parameterValues->map(function ($item) {
                if ($item->Code == 'PC_TRACH_NHIEM') {
                    return $item->pivot->Value;
                }
            })->sum();
        }

        $params = [
            '${number_contract}' => $contract->OrdinalNumber ? $contract->OrdinalNumber . '/' . $contract->NumberForm : $contract->ContractNumber,
            '${date_contract}' => $contract->ContractDate->format('d-m-Y'),
            '${day}' => $contract->ContractDate->format('d'),
            '${month}' => $contract->ContractDate->format('m'),
            '${year}' => $contract->ContractDate->format('Y'),
            '${represent}' => !is_null($represent) ? $represent->FullName : '',
            '${position}' =>  $positionRepresent,
            '${employee}' => $employee->FullName,
            '${birthday}' => $employee->DateOfBirth->format('d-m-Y'),
            '${born}' => $employee->PlaceOfBirth,
            '${nationality}' => $employee->Nationality,
            '${identity_card}' => $employee->IdCard,
            '${date_identity}' => $employee->DateOfIssueIdCard->format('d-m-Y'),
            '${place_provider}' => $employee->PlaceOfIssueIdCard,
            '${household}' => $employee->Address,
            '${place}' => $employee->PermanentAddress,
            '${from}' => $contract->ContractFrom ? 'ngày ' . $contract->ContractFrom->format('d') . ' tháng ' . $contract->ContractFrom->format('m') . ' năm ' . $contract->ContractFrom->format('Y') : '........',
            '${phone}' => $employee->PhoneNumber,
            '${salary}' => number_format($contract->BasicSalary),
            '${allowance}' => number_format($contract->TotalAllowance - $liabilityAllowance),
            '${liability_allowance}' => !is_null($liabilityAllowance) ? number_format($liabilityAllowance) : 0,
            '${total}' => number_format($contract->BasicSalary + $contract->TotalAllowance),
            'base' => $contract->IsAuthority ? '-      Căn cứ giấy ủy quyền ngày 17-08-2020 về việc ủy quyền ký hồ sơ đã được Giám đốc điều hành ủy quyền cho bà Nguyễn Thị Hồng An' : ''

        ];

        return $this->wordExporterServices->exportWord('contract_addendum', $params, $response);
    }

    public function previewLabourContractExportWord($id, $attributes)
    {
        $string = substr(uniqid(), 7);

        $labourContract = LabourContract::findOrFail($id);
        if ($attributes['action'] == 'contract') {
            $filePath = $this->exportWord($id, 'url');
            $fileName = $labourContract->Id . $string . '-contract' . '.docx';
        } elseif ($attributes['action'] == 'contract_authority') {
            $fileName = $labourContract->Id . $string . '-contract-authority' . '.docx';
            $filePath = $this->exportWordAuthority($id, 'url');
        } elseif ($attributes['action'] == 'contract_english') {
            $fileName = $labourContract->Id . $string . '-contract-english' . '.docx';
            $filePath = $this->exportWordEnglish($id, 'url');
        } elseif ($attributes['action'] == 'contract_addendum') {
            $fileName = $labourContract->Id . $string . '-contract-addendum' . '.docx';
            $filePath = $this->contractAddendum($id, 'url');
        }

        $file = Storage::disk('local')->get($filePath);

        Storage::disk('local')->put('public/files/' . $fileName, $file);

        return [
            'data' => [
                'url' => env('URL_FILE') . $fileName
            ]
        ];
    }
}
