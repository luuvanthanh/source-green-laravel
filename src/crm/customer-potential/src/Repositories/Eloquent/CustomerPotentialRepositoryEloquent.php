<?php

namespace GGPHP\Crm\CustomerPotential\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\CustomerPotential\Presenters\CustomerPotentialPresenter;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CustomerPotentialRepositoryEloquent extends BaseRepository implements CustomerPotentialRepository
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
        return CustomerPotential::class;
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
        return CustomerPotentialPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['id'])) {
            $this->model = $this->model->where('id', $attributes['id']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('full_name', $attributes['key'])->orWhereLike('phone', $attributes['key']);
        }

        if (!empty($attributes['city_id'])) {
            $this->model = $this->model->where('city_id', $attributes['city_id']);
        }

        if (!empty($attributes['district_id'])) {
            $this->model = $this->model->where('district_id', $attributes['district_id']);
        }

        if (!empty($attributes['facility_id'])) {
            $this->model = $this->model->where('facility_id', $attributes['facility_id']);
        }

        if (!empty($attributes['search_source_id'])) {
            $this->model = $this->model->where('search_source_id', $attributes['search_source_id']);
        }

        if (!empty($attributes['branch_id'])) {
            $this->model = $this->model->where('branch_id', $attributes['branch_id']);
        }

        if (!empty($attributes['employee_id'])) {
            $this->model = $this->model->where('employee_id', $attributes['employee_id']);
        }

        if (!empty($attributes['tag_id'])) {
            $this->model = $this->model->whereHas('customerPotentialTag', function ($query) use ($attributes) {
                $query->where('tag_id', $attributes['tag_id']);
            });
        }

        if (!empty($attributes['is_null_employee']) && $attributes['is_null_employee'] == 'true') {
            $this->model = $this->model->where('employee_id', null);
        }

        if (!empty($attributes['customer_lead_id'])) {
            $this->model = $this->model->where('customer_lead_id', $attributes['customer_lead_id']);
        }

        if (!empty($attributes['status_parent_potential_id'])) {
            $this->model = $this->model->whereHas('customerPotentialStatusCare', function ($query) use ($attributes) {
                $query->where('status_parent_potential_id', $attributes['status_parent_potential_id']);
            });
        }

        if (!empty($attributes['status_parent_lead_id'])) {
            $this->model = $this->model->whereHas('customerLead', function ($query01) use ($attributes) {
                $query01->whereHas('statusCare', function ($query02) use ($attributes) {
                    $query02->where('status_parent_lead_id', $attributes['status_parent_lead_id']);
                });
            });
        }

        if (!empty($attributes['limit'])) {
            $customerPotential = $this->paginate($attributes['limit']);
        } else {
            $customerPotential = $this->get();
        }

        return $customerPotential;
    }

    public function create(array $attributes)
    {
        $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
        $customerPotential_code = CustomerPotential::max('code');

        if (is_null($customerPotential_code)) {
            $attributes['code'] = CustomerPotential::CODE . $now . '01';
        } else {

            if (substr($customerPotential_code, 2, 8)  != $now) {
                $attributes['code'] = CustomerPotential::CODE . $now . '01';
            } else {
                $stt = substr($customerPotential_code, 2) + 1;
                $attributes['code'] = CustomerPotential::CODE . $stt;
            }
        }
        $customerPotential = CustomerPotential::create($attributes);

        return $this->parserResult($customerPotential);
    }

    public function createEmployeeAssignment($attributes)
    {
        foreach ($attributes['employee_assignment'] as $value) {
            $customerPotential = CustomerPotential::findOrFail($value['customer_potential_id']);
            $customerPotential->update(['employee_id' => $value['employee_id']]);
            $employeeInfo = json_encode($value['employee_info']);
            $customerPotential->update(['employee_info' => $employeeInfo]);
        }

        return parent::parserResult($customerPotential);
    }
}
