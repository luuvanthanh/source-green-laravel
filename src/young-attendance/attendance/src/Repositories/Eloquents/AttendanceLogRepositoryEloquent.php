<?php

namespace GGPHP\Attendance\Repositories\Eloquent;

use GGPHP\Attendance\Models\AttendanceLog;
use GGPHP\Attendance\Presenters\AttendanceLogPresenter;
use GGPHP\Attendance\Repositories\Contracts\AttendanceLogRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class AttendanceLogRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AttendanceLogRepositoryEloquent extends CoreRepositoryEloquent implements AttendanceLogRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AttendanceLog::class;
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
        return AttendanceLogPresenter::class;
    }
}
