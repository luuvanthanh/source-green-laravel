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

}
