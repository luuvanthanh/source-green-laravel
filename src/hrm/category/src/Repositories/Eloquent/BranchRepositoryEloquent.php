<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Branch;
use GGPHP\Category\Presenters\BranchPresenter;
use GGPHP\Category\Repositories\Contracts\BranchRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Core\Services\CrmService;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class BranchRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BranchRepositoryEloquent extends CoreRepositoryEloquent implements BranchRepository
{
    protected $fieldSearchable = [
        'Id',
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

    public function getBranch(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $branch = $this->paginate($attributes['limit']);
        } else {
            $branch = $this->get();
        }

        return $branch;
    }
}
