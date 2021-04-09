<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\TrainingSchool;
use GGPHP\Category\Presenters\TrainingSchoolPresenter;
use GGPHP\Category\Repositories\Contracts\TrainingSchoolRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class TrainingSchoolRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class TrainingSchoolRepositoryEloquent extends BaseRepository implements TrainingSchoolRepository
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
        return TrainingSchool::class;
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
        return TrainingSchoolPresenter::class;
    }

}
