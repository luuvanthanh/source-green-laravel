<?php

namespace GGPHP\BusRegistration\Repositories\Eloquent;

use GGPHP\BusRegistration\Models\BusRegistration;
use GGPHP\BusRegistration\Presenters\BusRegistrationPresenter;
use GGPHP\BusRegistration\Repositories\Contracts\BusRegistrationRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
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
    ];

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

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $busRegistration = $this->paginate($attributes['limit']);
        } else {
            $busRegistration = $this->get();
        }

        return $busRegistration;
    }

}
