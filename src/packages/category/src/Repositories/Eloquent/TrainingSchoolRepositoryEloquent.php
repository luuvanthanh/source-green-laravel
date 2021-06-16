<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\TrainingSchool;
use GGPHP\Category\Presenters\TrainingSchoolPresenter;
use GGPHP\Category\Repositories\Contracts\TrainingSchoolRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TrainingSchoolRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class TrainingSchoolRepositoryEloquent extends CoreRepositoryEloquent implements TrainingSchoolRepository
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

    public function getTrainingSchool(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $trainingSchool = $this->paginate($attributes['limit']);
        } else {
            $trainingSchool = $this->get();
        }

        return $trainingSchool;
    }
}
