<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Block;
use GGPHP\Category\Presenters\BlockPresenter;
use GGPHP\Category\Repositories\Contracts\BlockRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class BlockRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class BlockRepositoryEloquent extends CoreRepositoryEloquent implements BlockRepository
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
        return Block::class;
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
        return BlockPresenter::class;
    }

    public function getBlock(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $degree = $this->paginate($attributes['limit']);
        } else {
            $degree = $this->get();
        }

        return $degree;
    }
}
