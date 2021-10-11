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

        if (!empty($attributes['employee_id'])) {
            $this->model = $this->model->where('employee_id', $attributes['employee_id']);
        }

        if (!empty($attributes['tag_id'])) {
            $this->model = $this->model->whereHas('customerPotentialTag', function ($query) use ($attributes) {
                $query->where('tag_id', $attributes['tag_id']);
            });
        }

        if (!empty($attributes['limit'])) {
            $customerLead = $this->paginate($attributes['limit']);
        } else {
            $customerLead = $this->get();
        }

        return $customerLead;
    }

    public function create(array $attributes)
    {
        $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
        $customerLead_code = CustomerPotential::max('code');

        if (is_null($customerLead_code)) {
            $attributes['code'] = CustomerPotential::CODE . $now . "01";
        } else {

            if (substr($customerLead_code, 2, 8)  != $now) {
                $attributes['code'] = CustomerPotential::CODE . $now . "01";
            } else {
                $stt = substr($customerLead_code, 2) + 1;
                $attributes['code'] = CustomerPotential::CODE . $stt;
            }
        }
        $customerLead = CustomerPotential::create($attributes);

        return $this->parserResult($customerLead);
    }
}
