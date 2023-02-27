<?php

namespace GGPHP\Appoint\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Appoint\Models\Appoint;
use GGPHP\Appoint\Presenters\AppointPresenter;
use GGPHP\Appoint\Repositories\Contracts\AppointRepository;
use GGPHP\Appoint\Services\AppointDetailServices;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\DecisionNumberSample\Repositories\Eloquent\DecisionNumberSampleRepositoryEloquent;
use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class AppointRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AppointRepositoryEloquent extends CoreRepositoryEloquent implements AppointRepository
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
        return Appoint::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return AppointPresenter::class;
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
            $appoint = Appoint::create($attributes);
            resolve(DecisionNumberSampleRepositoryEloquent::class)->updateOrdinalNumberOfCreated($appoint, $attributes);
            AppointDetailServices::add($appoint->Id, $attributes['data'], $appoint->TimeApply);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($appoint->Id);
    }

    public function update(array $attributes, $id)
    {
        $appoint = Appoint::findOrfail($id);

        \DB::beginTransaction();
        try {
            $appoint->update($attributes);
            resolve(DecisionNumberSampleRepositoryEloquent::class)->updateOrdinalNumberOfUpdated($appoint->refresh(), $attributes);
            AppointDetailServices::update($appoint->Id, $attributes['data'], $appoint->TimeApply);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($appoint->Id);
    }

    public function getAppoint(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $this->model = $this->model->whereHas('appointDetails', function ($query) use ($attributes) {
                $employeeId = explode(',', $attributes['employeeId']);
                $query->whereIn('EmployeeId', $employeeId);
            });
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('appointDetails', function ($query) use ($attributes) {
                $query->whereHas('employee', function ($q2) use ($attributes) {
                    $q2->whereLike('FullName', $attributes['fullName']);
                });
            });
        }

        if (!empty($attributes['limit'])) {
            $appoint = $this->paginate($attributes['limit']);
        } else {
            $appoint = $this->get();
        }

        return $appoint;
    }

    public function exportWord($id)
    {
        $appoint = Appoint::findOrFail($id);
        $now = Carbon::now();

        $detail = $appoint->appointDetails->first();
        $employee = $detail->employee;
        $params = [
            'decisionNumber' => $appoint->DecisionNumber,
            'dateNow' => $appoint->DecisionDate->format('d'),
            'monthNow' => $appoint->DecisionDate->format('m'),
            'yearNow' => $appoint->DecisionDate->format('Y'),
            'decisionDate' => $appoint->DecisionDate ? $appoint->DecisionDate->format('d/m/Y') : '......',
            'timeApply' => $appoint->TimeApply ? $appoint->TimeApply->format('d/m/Y') : '......',
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'yearBirthday' => $employee->DateOfBirth ? $employee->DateOfBirth->format('Y') : '........',
            'branchWord' => $detail->branch ? $detail->branch->Name : '........',
            'positionDivision' => $detail->position && $detail->division ? $detail->position->Name . ' - ' . $detail->division->Name : '........',
            'position' => $detail->position ? $detail->position->Name : '........',
            'class' => $detail->class ? $detail->class->Name : '........',
            'yearStudy' => $appoint->DecisionDate ? $appoint->DecisionDate->subYear()->format('Y') . ' - ' . $appoint->DecisionDate->format('Y') : '.......',
        ];

        return $this->wordExporterServices->exportWord('appoint', $params);
    }

    public function delete($id)
    {
        $appoint = Appoint::findOrFail($id);

        $appoint->appointDetails()->delete();

        return $appoint->delete();
    }
}
