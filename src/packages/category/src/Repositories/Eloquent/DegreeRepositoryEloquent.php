<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Degree;
use GGPHP\Category\Presenters\DegreePresenter;
use GGPHP\Category\Repositories\Contracts\DegreeRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class DegreeRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class DegreeRepositoryEloquent extends BaseRepository implements DegreeRepository
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
