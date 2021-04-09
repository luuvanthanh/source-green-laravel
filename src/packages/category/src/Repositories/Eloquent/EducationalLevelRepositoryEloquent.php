<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\EducationalLevel;
use GGPHP\Category\Presenters\EducationalLevelPresenter;
use GGPHP\Category\Repositories\Contracts\EducationalLevelRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class EducationalLevelRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class EducationalLevelRepositoryEloquent extends BaseRepository implements EducationalLevelRepository
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
        return EducationalLevel::class;
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
        return EducationalLevelPresenter::class;
    }

}
