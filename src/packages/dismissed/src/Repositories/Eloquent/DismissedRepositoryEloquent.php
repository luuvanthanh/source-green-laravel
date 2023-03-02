<?php

namespace GGPHP\Dismissed\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\DecisionNumberSample\Repositories\Eloquent\DecisionNumberSampleRepositoryEloquent;
use GGPHP\Dismissed\Models\Dismissed;
use GGPHP\Dismissed\Presenters\DismissedPresenter;
use GGPHP\Dismissed\Repositories\Contracts\DismissedRepository;
use GGPHP\Dismissed\Services\DismissedDetailServices;
use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

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
            resolve(DecisionNumberSampleRepositoryEloquent::class)->updateOrdinalNumberOfCreated($dismissed, $attributes);
            DismissedDetailServices::add($dismissed->Id, $attributes['data'], $dismissed->TimeApply);
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($dismissed->Id);
    }

    public function update(array $attributes, $id)
    {
        $dismissed = Dismissed::findOrfail($id);

        \DB::beginTransaction();
        try {
            $dismissed->update($attributes);
            resolve(DecisionNumberSampleRepositoryEloquent::class)->updateOrdinalNumberOfUpdated($dismissed->refresh(), $attributes);
            DismissedDetailServices::update($dismissed->Id, $attributes['data'], $dismissed->TimeApply);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
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
            'timeApply' => $dismissed->TimeApply->format('d/m/Y'),
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
