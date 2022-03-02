<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Category\Models\ParamaterValue;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use GGPHP\Profile\Models\CollaboratorContract;
use GGPHP\Profile\Presenters\CollaboratorContractPresenter;
use GGPHP\Profile\Repositories\Contracts\CollaboratorContractRepository;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CollaboratorContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CollaboratorContractRepositoryEloquent extends CoreRepositoryEloquent implements CollaboratorContractRepository
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
        return CollaboratorContract::class;
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
        return CollaboratorContractPresenter::class;
    }

    public function getCollaboratorContract(array $attributes)
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
            $collaboratorContract = $this->paginate($attributes['limit']);
        } else {
            $collaboratorContract = $this->get();
        }

        return $collaboratorContract;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $collaboratorContract = CollaboratorContract::create($attributes);
            $totalAllowance = 0;
            $basicSalary = 0;

            foreach ($attributes['detail'] as $value) {
                $parameterValue = ParamaterValue::find($value['parameterValueId']);
                //dd($parameterValue);
                if ($parameterValue->Code != 'LUONG_CB') {
                    $totalAllowance += $value['value'];
                } else {
                    $basicSalary = $value['value'];
                }
                
                $collaboratorContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }
            
            $collaboratorContract->update([
                'TotalAllowance' => $totalAllowance,
                'BasicSalary' => $basicSalary
            ]);

            $dataPosition = [
                'employeeId' => $attributes['employeeId'],
                'branchId' => $attributes['branchId'],
                'positionId' => $attributes['positionId'],
                'divisionId' => $attributes['divisionId'],
                'startDate' => $collaboratorContract->ContractFrom->format('Y-m-d'),
                'type' => 'COLLABORATOR',
                'ModelId' => $collaboratorContract->Id,
                'ModelType' => CollaboratorContract::class,
            ];

            $collaboratorContract->employee->update(['DateOff' => null]);
            $this->positionLevelRepository->create($dataPosition);

            $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $attributes['divisionId'])->where([['StartDate', '<=', $collaboratorContract->ContractFrom->format('Y-m-d')], ['EndDate', '>=', $collaboratorContract->ContractFrom->format('Y-m-d')]])->first();

            if (!is_null($divisionShift)) {
                $dataSchedule = [
                    'employeeId' => $attributes['employeeId'],
                    'shiftId' => $divisionShift->ShiftId,
                    'startDate' => $collaboratorContract->ContractFrom->format('Y-m-d'),
                    'endDate' => $collaboratorContract->ContractTo->format('Y-m-d'),
                    'interval' => 1,
                    'repeatBy' => 'daily',
                ];

                $this->scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
            }
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($collaboratorContract->Id);
    }

    public function update(array $attributes, $id)
    {
        $collaboratorContract = CollaboratorContract::findOrFail($id);

        \DB::beginTransaction();
        try {
            $collaboratorContract->update($attributes);
            $collaboratorContract->parameterValues()->detach();
            $totalAllowance = 0;
            $basicSalary = 0;

            foreach ($attributes['detail'] as $value) {
                $parameterValue = ParamaterValue::find($value['parameterValueId']);

                if ($parameterValue->Code != 'LUONG_CB') {
                    $totalAllowance += $value['value'];
                } else {
                    $basicSalary = $value['value'];
                }

                $collaboratorContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            $collaboratorContract->update([
                'TotalAllowance' => $totalAllowance,
                'BasicSalary' => $basicSalary
            ]);

            $positionLevel = $collaboratorContract->positionLevel;
            $dataPosition = [
                'employeeId' => $collaboratorContract->EmployeeId,
                'branchId' => $collaboratorContract->BranchId,
                'positionId' => $collaboratorContract->PositionId,
                'divisionId' => $collaboratorContract->DivisionId,
                'startDate' => $collaboratorContract->ContractFrom->format('Y-m-d'),
                'type' => 'COLLABORATORS',
                'ModelId' => $collaboratorContract->Id,
                'ModelType' => CollaboratorContract::class,
            ];

            if (!is_null($positionLevel)) {
                $this->positionLevelRepository->update($dataPosition, $positionLevel->Id);
            } else {
                $this->positionLevelRepository->create($dataPosition);
            }

            $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $collaboratorContract->DivisionId)->where([['StartDate', '<=', $collaboratorContract->ContractFrom->format('Y-m-d')], ['EndDate', '>=', $collaboratorContract->ContractFrom->format('Y-m-d')]])->first();

            if (!is_null($divisionShift)) {
                $dataSchedule = [
                    'employeeId' => $attributes['employeeId'],
                    'shiftId' => $divisionShift->ShiftId,
                    'startDate' => $collaboratorContract->ContractFrom->format('Y-m-d'),
                    'endDate' => $collaboratorContract->ContractTo->format('Y-m-d'),
                    'interval' => 1,
                    'repeatBy' => 'daily',
                ];

                $this->scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($collaboratorContract->Id);
    }

    public function exportWord($id)
    {
        $collaboratorContract = CollaboratorContract::findOrFail($id);
        $now = Carbon::now();

        $employee = $collaboratorContract->employee;
        $params = [
            'contractNumber' => $collaboratorContract->ContractNumber,
            'dateNow' => $collaboratorContract->ContractDate->format('d'),
            'monthNow' => $collaboratorContract->ContractDate->format('m'),
            'yearNow' => $collaboratorContract->ContractDate->format('Y'),
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
            'typeContract' => $collaboratorContract->typeOfContract ? $collaboratorContract->typeOfContract->Name : '........',
            'from' => $collaboratorContract->ContractFrom ? $collaboratorContract->ContractFrom->format('d-m-Y') : '........',
            'to' => $collaboratorContract->ContractTo ? $collaboratorContract->ContractTo->format('d-m-Y') : '........',
            'position' => $collaboratorContract->position ? $collaboratorContract->position->Name : '........',
            'branchWord' => $collaboratorContract->branch ? $collaboratorContract->branch->Name : '........',
            'workTime' => $collaboratorContract->WorkTime ? $collaboratorContract->WorkTime : '.......',
            'salary' => number_format($collaboratorContract->BasicSalary),
        ];

        return $this->wordExporterServices->exportWord('labour_contract', $params);
    }

    public function delete($id)
    {
        $collaboratorContract = CollaboratorContract::findOrFail($id);

        $collaboratorContract->parameterValues()->detach();

        return $collaboratorContract->delete();
    }
}
