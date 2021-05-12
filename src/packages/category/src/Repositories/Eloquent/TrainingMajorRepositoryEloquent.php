<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\TrainingMajor;
use GGPHP\Category\Presenters\TrainingMajorPresenter;
use GGPHP\Category\Repositories\Contracts\TrainingMajorRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TrainingMajorRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class TrainingMajorRepositoryEloquent extends CoreRepositoryEloquent implements TrainingMajorRepository
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
        return TrainingMajor::class;
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
        return TrainingMajorPresenter::class;
    }

}
