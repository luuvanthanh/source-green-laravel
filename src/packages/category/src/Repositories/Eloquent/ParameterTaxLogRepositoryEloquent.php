<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\ParameterTaxLog;
use GGPHP\Category\Presenters\ParameterTaxLogPresenter;
use GGPHP\Category\Repositories\Contracts\ParameterTaxLogRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ParameterTaxLogRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class ParameterTaxLogRepositoryEloquent extends CoreRepositoryEloquent implements ParameterTaxLogRepository
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
        return ParameterTaxLog::class;
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
        return ParameterTaxLogPresenter::class;
    }
}
