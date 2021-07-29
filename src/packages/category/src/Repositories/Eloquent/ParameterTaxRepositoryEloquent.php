<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\ParameterTax;
use GGPHP\Category\Presenters\ParameterTaxPresenter;
use GGPHP\Category\Repositories\Contracts\ParameterTaxRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ParameterTaxRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class ParameterTaxRepositoryEloquent extends CoreRepositoryEloquent implements ParameterTaxRepository
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
        return ParameterTax::class;
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
        return ParameterTaxPresenter::class;
    }

    public function getParameterTax(array $attributes)
    {

        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $paramaterTax = $this->paginate($attributes['limit']);
        } else {
            $paramaterTax = $this->get();
        }

        return $paramaterTax;
    }
}
