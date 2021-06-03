<?php

namespace GGPHP\Attendance\Repositories\Eloquents;

use GGPHP\Attendance\Models\AttendanceReason;
use GGPHP\Attendance\Presenters\AttendanceReasonPresenter;
use GGPHP\Attendance\Repositories\Contracts\AttendanceReasonRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class AttendanceReasonRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AttendanceReasonRepositoryEloquent extends CoreRepositoryEloquent implements AttendanceReasonRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AttendanceReason::class;
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
        return AttendanceReasonPresenter::class;
    }
}
