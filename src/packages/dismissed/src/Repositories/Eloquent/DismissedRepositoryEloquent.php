<?php

namespace GGPHP\Dismissed\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Dismissed\Models\Dismissed;
use GGPHP\Dismissed\Presenters\DismissedPresenter;
use GGPHP\Dismissed\Repositories\Contracts\DismissedRepository;
use GGPHP\Dismissed\Services\DismissedDetailServices;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class DismissedRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DismissedRepositoryEloquent extends CoreRepositoryEloquent implements DismissedRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
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
        $this->wordExporterServices = $wordExporterServices;
        $this->positionLevelRepository = $positionLevelRepository;
        $this->scheduleRepositoryEloquent = $scheduleRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Dismissed::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return DismissedPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $dismissed = Dismissed::create($attributes);
            DismissedDetailServices::add($dismissed->Id, $attributes['data']);

            foreach ($attributes['data'] as $value) {
                $dataPosition = [
                    'employeeId' => $value['employeeId'],
                    'branchId' => $value['branchId'],
                    'positionId' => $value['positionId'],
                    'divisionId' => $value['divisionId'],
                    'startDate' => $tranfer->TimeApply->format('Y-m-d'),
                    'type' => 'DISMISSED',
                ];

                $this->positionLevelRepository->create($dataPosition);

                $divisionShift = \GGPHP\ShiftSchedule\Models\DivisionShift::where('DivisionId', $value['divisionId'])->where([['StartDate', '<=', $tranfer->TimeApply->format('Y-m-d')], ['EndDate', '>=', $tranfer->TimeApply->format('Y-m-d')]])->first();

                if (!is_null($divisionShift)) {
                    $dataSchedule = [
                        'employeeId' => $value['employeeId'],
                        'shiftId' => $divisionShift->ShiftId,
                        'startDate' => $tranfer->TimeApply->format('Y-m-d'),
                        'endDate' => $tranfer->TimeApply->addYear()->format('Y-m-d'),
                        'interval' => 1,
                        'repeatBy' => 'daily',
                    ];

                    $this->scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
                }
            }
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($dismissed->Id);
    }

    public function getDismissed(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $this->model = $this->model->whereHas('dismissedDetails', function ($query) use ($attributes) {
                $employeeId = explode(',', $attributes['employeeId']);
                $query->whereIn('EmployeeId', $employeeId);
            });
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('dismissedDetails', function ($query) use ($attributes) {
                $query->whereHas('employee', function ($q2) use ($attributes) {
                    $q2->whereLike('FullName', $attributes['fullName']);
                });
            });
        }

        if (!empty($attributes['limit'])) {
            $dismissed = $this->paginate($attributes['limit']);
        } else {
            $dismissed = $this->get();
        }

        return $dismissed;
    }

    public function exportWord($id)
    {
        $dismissed = Dismissed::findOrFail($id);
        $now = Carbon::now();

        $detail = $dismissed->dismissedDetails->first();
        $employee = $detail->employee;
        $params = [
            'decisionNumber' => $dismissed->DecisionNumber,
            'dateNow' => $dismissed->DecisionDate ? $dismissed->DecisionDate->format('d') : '.......',
            'monthNow' => $dismissed->DecisionDate ? $dismissed->DecisionDate->format('m') : '.......',
            'yearNow' => $dismissed->DecisionDate ? $dismissed->DecisionDate->format('Y') : '.......',
            'decisionDate' => $dismissed->DecisionDate->format('d/m/Y'),
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'yearBirthday' => $employee->DateOfBirth ? $employee->DateOfBirth->format('Y') : '........',
            'branchWord' => $detail->branch ? $detail->branch->Name : '........',
            'position' => $detail->position ? $detail->position->Name : '........',
        ];

        return $this->wordExporterServices->exportWord('dismissed', $params);
    }

    public function delete($id)
    {
        $dismissed = Dismissed::findOrFail($id);

        $dismissed->dismissedDetails()->delete();

        return $dismissed->delete();
    }
}
