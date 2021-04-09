<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\ParamaterFormulaLog;
use GGPHP\Category\Presenters\ParamaterFormulaLogPresenter;
use GGPHP\Category\Repositories\Contracts\ParamaterFormulaLogRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ParamaterFormulaLogRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class ParamaterFormulaLogRepositoryEloquent extends BaseRepository implements ParamaterFormulaLogRepository
{
    protected $fieldSearchable = [
        'id',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ParamaterFormulaLog::class;
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
        return ParamaterFormulaLogPresenter::class;
    }

}
