<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use GGPHP\Profile\Models\SabbaticalLeave;
use GGPHP\Profile\Presenters\SabbaticalLeavePresenter;
use GGPHP\Profile\Repositories\Contracts\SabbaticalLeaveRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SabbaticalLeaveRepositoryEloquent extends BaseRepository implements SabbaticalLeaveRepository
{
    protected $fieldSearchable = [
        'employeeId',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SabbaticalLeave::class;
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
        return SabbaticalLeavePresenter::class;
    }
}
