<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Degree;
use GGPHP\Category\Presenters\DegreePresenter;
use GGPHP\Category\Repositories\Contracts\DegreeRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class DegreeRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class DegreeRepositoryEloquent extends CoreRepositoryEloquent implements DegreeRepository
{
    protected $fieldSearchable = [
        'Id',
        'Name' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Degree::class;
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
        return DegreePresenter::class;
    }

}
