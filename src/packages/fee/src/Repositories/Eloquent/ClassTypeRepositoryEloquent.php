<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\ClassType;
use GGPHP\Fee\Presenters\ClassTypePresenter;
use GGPHP\Fee\Repositories\Contracts\ClassTypeRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ClassTypeRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ClassTypeRepositoryEloquent extends CoreRepositoryEloquent implements ClassTypeRepository
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
        return ClassType::class;
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
        return ClassTypePresenter::class;
    }

    public function filterClassType(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['type'])) {
            $this->model = $this->model->where('Type', $attributes['type']);
        }

        if (!empty($attributes['limit'])) {
            $fee = $this->paginate($attributes['limit']);
        } else {
            $fee = $this->get();
        }

        return $fee;
    }

}
