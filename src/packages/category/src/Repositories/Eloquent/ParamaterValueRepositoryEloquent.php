<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\ParamaterValue;
use GGPHP\Category\Presenters\ParamaterValuePresenter;
use GGPHP\Category\Repositories\Contracts\ParamaterValueRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ParamaterValueRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class ParamaterValueRepositoryEloquent extends CoreRepositoryEloquent implements ParamaterValueRepository
{
    protected $fieldSearchable = [
        'Id',
        'Name' => 'like',
        'Code' => 'like',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ParamaterValue::class;
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
        return ParamaterValuePresenter::class;
    }

    public function getParamaterValue(array $attributes)
    {
        if (!empty($attributes['type'])) {
            $this->model = $this->model->where('Type', $attributes['type']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $paramaterValue = $this->paginate($attributes['limit']);
        } else {
            $paramaterValue = $this->get();
        }

        return $paramaterValue;
    }
}
