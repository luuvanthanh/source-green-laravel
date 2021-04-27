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

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['attendance' => function ($query) use ($attributes) {
                $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
            }]);
        }

        if (!empty($attributes['studentId'])) {
            $studentId = explode(',', $attributes['studentId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereIn('Id', $studentId);
        }

        if (!empty($attributes['limit'])) {
            $inOutHistories = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $inOutHistories = $this->studentRepositoryEloquent->get();
        }

        return $inOutHistories;
    }
}
