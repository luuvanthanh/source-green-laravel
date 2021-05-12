<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Branch;
use GGPHP\Category\Presenters\BranchPresenter;
use GGPHP\Category\Repositories\Contracts\BranchRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class BranchRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BranchRepositoryEloquent extends CoreRepositoryEloquent implements BranchRepository
{
    protected $fieldSearchable = [
        'Id',
        'Name' => 'like',
        'CreationTime',
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
