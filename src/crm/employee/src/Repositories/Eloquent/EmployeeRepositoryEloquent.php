<?php

namespace GGPHP\Crm\Employee\Repositories\Eloquent;

use GGPHP\Crm\Employee\Models\Employee;
use GGPHP\Crm\Employee\Presenters\EmployeePresenter;
use GGPHP\Crm\Employee\Repositories\Contracts\EmployeeRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class EmployeeRepositoryEloquent extends BaseRepository implements EmployeeRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Employee::class;
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
        return EmployeePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('full_name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $employee = $this->paginate($attributes['limit']);
        } else {
            $employee = $this->get();
        }

        return $employee;
    }
}
