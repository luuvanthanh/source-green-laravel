<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\StudentObject;
use GGPHP\Fee\Presenters\StudentObjectPresenter;
use GGPHP\Fee\Repositories\Contracts\StudentObjectRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class StudentObjectRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class StudentObjectRepositoryEloquent extends CoreRepositoryEloquent implements StudentObjectRepository
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
        return StudentObject::class;
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
        return StudentObjectPresenter::class;
    }

    public function filterStudentObject(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $studentObject = $this->paginate($attributes['limit']);
        } else {
            $studentObject = $this->get();
        }

        return $studentObject;
    }
}
