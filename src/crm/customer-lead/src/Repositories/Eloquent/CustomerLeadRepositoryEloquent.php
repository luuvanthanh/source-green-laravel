<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Presenters\CustomerLeadPresenter;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerLeadRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CustomerLeadRepositoryEloquent extends BaseRepository implements CustomerLeadRepository
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
        return CustomerLead::class;
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
        return CustomerLeadPresenter::class;
    }

    public function getCustomerLead(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('full_name', 'like', '%' . $attributes['key'] . '%')
                ->orWhere('phone', 'like', '%' . $attributes['key'] . 'key');
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

        if (!empty($attributes['employee_id'])) {
            $this->model = $this->model->where('employee_id', $attributes['employee_id']);
        }

        if (!empty($attributes['limit'])) {
            $customerLead = $this->paginate($attributes['limit']);
        } else {
            $customerLead = $this->get();
        }

        return $customerLead;
    }
}
