<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\TrainingMajor;
use GGPHP\Category\Presenters\TrainingMajorPresenter;
use GGPHP\Category\Repositories\Contracts\TrainingMajorRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class TrainingMajorRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class TrainingMajorRepositoryEloquent extends BaseRepository implements TrainingMajorRepository
{
    protected $fieldSearchable = [
        'id',
        'name' => 'like',
        'code' => 'like',
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
