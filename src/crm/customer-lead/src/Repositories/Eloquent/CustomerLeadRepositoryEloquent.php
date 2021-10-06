<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use Carbon\Carbon;
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
            $this->model = $this->model->whereHas('customerTag', function ($query) use ($attributes) {
                $query->where('tag_id', $attributes['tag_id']);
            });
        }

        if (!empty($attributes['is_null_employee']) && $attributes['is_null_employee'] == 'true') {
            $this->model = $this->model->where('employee_id', null);
        }

        if (
            !empty($attributes['full_name']) && $attributes['full_name'] == 'true' && !empty($attributes['email']) && $attributes['email'] == 'true'
            && !empty($attributes['address']) && $attributes['address'] == 'true' && !empty($attributes['phone']) && $attributes['phone'] == 'true'
            && !empty($attributes['children_full_name']) && $attributes['children_full_name'] == 'true' && !empty($attributes['children_birth_date']) && $attributes['children_birth_date'] == 'true'
        ) {
            $this->model = $this->model->whereIn('full_name', function ($query) {
                $query->select('customer_leads.full_name')->from('customer_leads')->groupBy('customer_leads.full_name')->havingRaw('count(*) > 1');
            })->whereIn('email', function ($query) {
                $query->select('customer_leads.email')->from('customer_leads')->groupBy('customer_leads.email')->havingRaw('count(*) > 1');
            })->whereIn('address', function ($query) {
                $query->select('customer_leads.address')->from('customer_leads')->groupBy('customer_leads.address')->havingRaw('count(*) > 1');
            })->whereIn('phone', function ($query) {
                $query->select('customer_leads.phone')->from('customer_leads')->groupBy('customer_leads.phone')->havingRaw('count(*) > 1');
            })->whereHas('studentInfo', function ($query) {
                $query->whereIn('full_name', function ($q) {
                    $q->select('student_infos.full_name')->from('student_infos')->groupBy('student_infos.full_name')->havingRaw('count(*) > 1');
                })->whereIn('birth_date', function ($q) {
                    $q->select('student_infos.birth_date')->from('student_infos')->groupBy('student_infos.birth_date')->havingRaw('count(*) > 1');
                });
            });
        }

        if (!empty($attributes['customer_lead_id'])) {
            $this->model = $this->model->whereIn('id', $attributes['customer_lead_id']);
        }

        if (!empty($attributes['limit'])) {
            $customerLead = $this->paginate($attributes['limit']);
        } else {
            $customerLead = $this->get();
        }

        return $customerLead;
    }

    public function createEmployeeAssignment($attributes)
    {
        foreach ($attributes['employee_assignment'] as $value) {
            $customerLead = CustomerLead::findOrFail($value['customer_lead_id']);
            $customerLead->update(['employee_id' => $value['employee_id']]);
            $employeeInfo = json_encode($value['employee_info']);
            $customerLead->update(['employee_info' => $employeeInfo]);
        }

        return parent::parserResult($customerLead);
    }

    public function mergeCustomerLead($attributes)
    {

        $mergeCustomerLead = CustomerLead::whereIn('id', $attributes['merge_customer_lead_id'])->orderBy('created_at', 'DESC')->first();
        $mergeCustomerLead->update($attributes);
        CustomerLead::whereIn('id', $attributes['merge_customer_lead_id'])->where('id', '!=', $mergeCustomerLead->id)->forceDelete();

        return parent::parserResult($mergeCustomerLead);
    }

    public function create(array $attributes)
    {
        $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
        $customerLead_code = CustomerLead::max('code');

        if (is_null($customerLead_code)) {
            $attributes['code'] = CustomerLead::CODE . $now . "01";
        } else {

            if (substr($customerLead_code, 2, 8)  != $now) {
                $attributes['code'] = CustomerLead::CODE . $now . "01";
            } else {
                $stt = substr($customerLead_code, 2) + 1;
                $attributes['code'] = CustomerLead::CODE . $stt;
            }
        }
        $customerLead = CustomerLead::create($attributes);

        return $this->parserResult($customerLead);
    }
}
