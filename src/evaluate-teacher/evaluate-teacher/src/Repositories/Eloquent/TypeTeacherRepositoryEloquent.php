<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Repositories\Eloquent;

use GGPHP\EvaluateTeacher\EvaluateTeacher\Models\EvaluateTeacher;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Presenters\EvaluateTeacherPresenter;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Repositories\Contracts\EvaluateTeacherRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class EvaluateTeacherRepositoryEloquent.
 *
 * @package namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Repositories\Eloquent;
 */
class EvaluateTeacherRepositoryEloquent extends CoreRepositoryEloquent implements EvaluateTeacherRepository
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
        return EvaluateTeacher::class;
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
        return EvaluateTeacherPresenter::class;
    }

    public function getEvaluateTeacher(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $degree = $this->paginate($attributes['limit']);
        } else {
            $degree = $this->get();
        }

        return $degree;
    }
}
