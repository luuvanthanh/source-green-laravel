<?php

namespace GGPHP\Clover\Repositories\Eloquent;

use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Presenters\StudentPresenter;
use GGPHP\Clover\Repositories\Contracts\StudentRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class StudentRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class StudentRepositoryEloquent extends CoreRepositoryEloquent implements StudentRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'FullName' => 'like',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Student::class;
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
        return StudentPresenter::class;
    }

    public function getStudent(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('FullName', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $student = $this->paginate($attributes['limit']);
        } else {
            $student = $this->get();
        }

        return $student;
    }
}
