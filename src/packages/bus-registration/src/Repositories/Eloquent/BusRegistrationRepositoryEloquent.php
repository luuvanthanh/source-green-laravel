<?php

namespace GGPHP\BusRegistration\Repositories\Eloquent;

use GGPHP\BusRegistration\Models\BusRegistration;
use GGPHP\BusRegistration\Presenters\BusRegistrationPresenter;
use GGPHP\BusRegistration\Repositories\Contracts\BusRegistrationRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class BusRegistrationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BusRegistrationRepositoryEloquent extends CoreRepositoryEloquent implements BusRegistrationRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
        'employee.FullName' => 'like',
    ];

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return BusRegistration::class;
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
        return BusRegistrationPresenter::class;
    }

    public function filterBusRegistration(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
        }

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
            $busRegistration = $this->paginate($attributes['limit']);
        } else {
            $busRegistration = $this->get();
        }

        return $busRegistration;
    }

    public function busRegistrationSummary(array $attributes)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('busRegistrations', function ($query) use ($attributes) {
            $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
        })->with(['busRegistrations' => function ($query) use ($attributes) {
            $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
        }]);

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereIn('Id', $employeeId);
        }

        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->tranferHistory($attributes);

        if (empty($attributes['limit'])) {
            $result = $this->employeeRepositoryEloquent->get();
        } else {
            $result = $this->employeeRepositoryEloquent->paginate($attributes['limit']);
        }

        return $result;
    }
}
