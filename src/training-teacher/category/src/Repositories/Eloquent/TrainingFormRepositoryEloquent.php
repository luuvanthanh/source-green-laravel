<?php

namespace GGPHP\TrainingTeacher\Category\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\TrainingTeacher\Category\Models\TrainingForm;
use GGPHP\TrainingTeacher\Category\Presenters\TrainingFormPresenter;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingFormRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TrainingFormRepositoryEloquent.
 *
 * @package namespace GGPHP\TrainingTeacher\Category\Repositories\Eloquent;
 */
class TrainingFormRepositoryEloquent extends CoreRepositoryEloquent implements TrainingFormRepository
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
        return TrainingForm::class;
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
        return TrainingFormPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $TrainingForm = $this->paginate($attributes['limit']);
        } else {
            $TrainingForm = $this->get();
        }

        return $TrainingForm;
    }
}
