<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Category\Models\ParamaterValue;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Presenters\LabourContractPresenter;
use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

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

                    $this->model = $this->model->where('ContractFrom', '<=', $now->format('Y-m-d'))->where('ContractTo', '>', $addMonth->format('Y-m-d'));
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

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('ContractDate', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))->where('ContractDate', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'));
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
            ];

            $labourContract->employee->update(['DateOff' => null]);
            $this->positionLevelRepository->create($dataPosition);

            $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $attributes['divisionId'])->where([['StartDate', '<=', $labourContract->ContractFrom->format('Y-m-d')], ['EndDate', '>=', $labourContract->ContractFrom->format('Y-m-d')]])->first();

            if (!is_null($divisionShift)) {
                $dataSchedule = [
                    'employeeId' => $attributes['employeeId'],
                    'shiftId' => $divisionShift->ShiftId,
                    'startDate' => $labourContract->ContractTo->format('Y-m-d'),
                    'endDate' => $labourContract->ContractFrom->format('Y-m-d'),
                    'interval' => 1,
                    'repeatBy' => 'daily',
                ];

                $this->scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
            }
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($labourContract->Id);
    }

    public function update(array $attributes, $id)
    {
        $labourContract = LabourContract::findOrFail($id);

        \DB::beginTransaction();
        try {
            $labourContract->update($attributes);
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


            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($labourContract->Id);
    }

    public function exportWord($id)
    {
        $labourContract = LabourContract::findOrFail($id);
        $now = Carbon::now();

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
            'placeOfIssueCard' => $employee->PlaceOfIssueIdCard ? $employee->PlaceOfIssueIdCard : '........',
            'permanentAddress' => $employee->PermanentAddress ? $employee->PermanentAddress : '........',
            'adress' => $employee->Address ? $employee->Address : '.......',
            'phone' => $employee->Phone ? $employee->Phone : '.......',
            'typeContract' => $labourContract->typeOfContract ? $labourContract->typeOfContract->Name : '........',
            'from' => $labourContract->ContractFrom ? $labourContract->ContractFrom->format('d-m-Y') : '........',
            'to' => $labourContract->ContractTo ? $labourContract->ContractTo->format('d-m-Y') : '........',
            'position' => $labourContract->position ? $labourContract->position->Name : '........',
            'branchWord' => $labourContract->branch ? $labourContract->branch->Name : '........',
            'workTime' => $labourContract->WorkTime ? $labourContract->WorkTime : '.......',
            'salary' => number_format($labourContract->parameterValues->where('Code', 'LUONG_CO_BAN')->first()->pivot->Value),
        ];

        return $this->wordExporterServices->exportWord('labour_contract', $params);
    }

    public function delete($id)
    {
        $labourContract = LabourContract::findOrFail($id);

        $labourContract->parameterValues()->detach();

        return $labourContract->delete();
    }
}
