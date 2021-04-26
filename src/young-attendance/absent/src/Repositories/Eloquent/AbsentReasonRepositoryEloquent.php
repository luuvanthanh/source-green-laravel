<?php

namespace GGPHP\YoungAttendance\Absent\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Models\AbsentReason;
use GGPHP\YoungAttendance\Absent\Presenters\AbsentReasonPresenter;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentReasonRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentReasonRepositoryEloquent extends CoreRepositoryEloquent implements AbsentReasonRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AbsentReason::class;
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
        return AbsentReasonPresenter::class;
    }
}
