<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\Branch;
use GGPHP\Crm\Category\Presenters\BranchPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\BranchRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BranchRepositoryEloquent extends BaseRepository implements BranchRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
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
        return BranchPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $branch = $this->paginate($attributes['limit']);
        } else {
            $branch = $this->get();
        }

        return $branch;
    }
}
