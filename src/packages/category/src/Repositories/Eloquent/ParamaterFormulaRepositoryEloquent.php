<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\ParamaterFormula;
use GGPHP\Category\Presenters\ParamaterFormulaPresenter;
use GGPHP\Category\Repositories\Contracts\ParamaterFormulaRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ParamaterFormulaRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class ParamaterFormulaRepositoryEloquent extends CoreRepositoryEloquent implements ParamaterFormulaRepository
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
        return ParamaterFormula::class;
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
        return ParamaterFormulaPresenter::class;
    }

    public function getParamaterFormula(array $attributes)
    {
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
