<?php

namespace GGPHP\Attendance\Repositories\Eloquents;

use GGPHP\Attendance\Models\Attendance;
use GGPHP\Attendance\Presenters\AttendancePresenter;
use GGPHP\Attendance\Repositories\Contracts\AttendanceRepository;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class AttendanceRepositoryEloquent.
 *
 * @package GGPHP\Attendance\Repositories\Eloquents;
 */
class AttendanceRepositoryEloquent extends BaseRepository implements AttendanceRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
    ];

    public function __construct(
        StudentRepositoryEloquent $studentRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->studentRepositoryEloquent = $studentRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Attendance::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return AttendancePresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Save many entity in repository
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function create(array $attributes)
    {
        $attendance = Attendance::where('StudentId', $attributes['studentId'])->where('Date', $attributes['date'])->first();

        if (is_null($attendance)) {
            $attendance = Attendance::create($attributes);
        } else {
            $attendance->update($attributes);
        }

        return $this->parserResult($attendance);
    }

    /**
     * Get all entity in repository
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function getAttendance($attributes)
    {
        if (!empty($attributes['date'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['attendance' => function ($query) use ($attributes) {
                $query->where('Date', $attributes['date']);
            }]);

            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
                $query->where([['StartDate', '>=', $attributes['date']], ['EndDate', '<=', $attributes['date']]]);
            }]);
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['attendance' => function ($query) use ($attributes) {
                $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
            }]);

            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
                $query->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
            }]);
        }

        if (!empty($attributes['studentId'])) {
            $studentId = explode(',', $attributes['studentId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereIn('Id', $studentId);
        }

        if (!empty($attributes['classId'])) {
            $classId = explode(',', $attributes['classId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('classStudent', function ($query) use ($classId) {
                $query->whereIn('ClassId', $classId);
            });
        }

        if (!empty($attributes['branchId'])) {
            $branchId = explode(',', $attributes['branchId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('classStudent', function ($query) use ($branchId) {
                $query->whereHas('branch', function ($query2) use ($branchId) {
                    $query2->whereIn('BranchId', $branchId);
                });
            });
        }

        if (!empty($attributes['limit'])) {
            $inOutHistories = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $inOutHistories = $this->studentRepositoryEloquent->get();
        }

        return $inOutHistories;
    }
}
