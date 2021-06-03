<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Profile\Models\SabbaticalLeave;
use GGPHP\Profile\Presenters\SabbaticalLeavePresenter;
use GGPHP\Profile\Repositories\Contracts\SabbaticalLeaveRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SabbaticalLeaveRepositoryEloquent extends CoreRepositoryEloquent implements SabbaticalLeaveRepository
{
    protected $fieldSearchable = [
        'Id',
        'employee.FullName' => 'like',
        'CreationTime',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SabbaticalLeave::class;
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
        return SabbaticalLeavePresenter::class;
    }

    public function getSabbaticalLeave(array $attributes)
    {
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['limit'])) {
            $sabbaticalLeave = $this->paginate($attributes['limit']);
        } else {
            $sabbaticalLeave = $this->get();
        }

        return $sabbaticalLeave;
    }
}
