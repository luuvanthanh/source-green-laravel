<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Branch;
use GGPHP\Category\Presenters\BranchPresenter;
use GGPHP\Category\Repositories\Contracts\BranchRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class BranchRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BranchRepositoryEloquent extends BaseRepository implements BranchRepository
{
    protected $fieldSearchable = [
        'id',
        'name' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Branch::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return BranchPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
