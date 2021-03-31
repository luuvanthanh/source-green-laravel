<?php

namespace GGPHP\Absent\Repositories\Eloquent;

use GGPHP\Absent\Models\AbsentReason;
use GGPHP\Absent\Presenters\AbsentReasonPresenter;
use GGPHP\Absent\Repositories\Absent\AbsentReasonRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentReasonRepositoryEloquent extends BaseRepository implements AbsentReasonRepository
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
