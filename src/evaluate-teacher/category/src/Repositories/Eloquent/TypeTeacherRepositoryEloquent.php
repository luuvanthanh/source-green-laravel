<?php

namespace GGPHP\EvaluateTeacher\Category\Repositories\Eloquent;

use GGPHP\EvaluateTeacher\Category\Models\TypeTeacher;
use GGPHP\EvaluateTeacher\Category\Presenters\TypeTeacherPresenter;
use GGPHP\EvaluateTeacher\Category\Repositories\Contracts\TypeTeacherRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TypeTeacherRepositoryEloquent.
 *
 * @package namespace GGPHP\EvaluateTeacher\Category\Repositories\Eloquent;
 */
class TypeTeacherRepositoryEloquent extends CoreRepositoryEloquent implements TypeTeacherRepository
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
        return TypeTeacher::class;
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
        return TypeTeacherPresenter::class;
    }

    public function getTypeTeacher(array $attributes)
    {
        if (!empty($attributes['typeTeacherId'])) {
            $typeTeacher = explode(',', $attributes['typeTeacherId']);
            $this->model = $this->model->whereIn('Id', $typeTeacher);
        }

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
