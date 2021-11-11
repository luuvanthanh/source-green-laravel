<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\CustomerTag;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use GGPHP\Crm\CustomerLead\Presenters\CustomerLeadPresenter;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerLeadRepository;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialTag;
use GGPHP\Crm\CustomerPotential\Models\PotentialStudentInfo;
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

        if (!empty($attributes['full_name']) && $attributes['full_name'] == 'true') {
            $this->model = $this->model->whereIn('full_name', function ($query) {
                $query->select('customer_leads.full_name')->from('customer_leads')->groupBy('customer_leads.full_name')->havingRaw('count(*) > 1');
            });
        }

        if (!empty($attributes['email']) && $attributes['email'] == 'true') {
            $this->model = $this->model->whereIn('email', function ($query) {
                $query->select('customer_leads.email')->from('customer_leads')->groupBy('customer_leads.email')->havingRaw('count(*) > 1');
            });
        }

        if (!empty($attributes['address']) && $attributes['address'] == 'true') {
            $this->model = $this->model->whereIn('address', function ($query) {
                $query->select('customer_leads.address')->from('customer_leads')->groupBy('customer_leads.address')->havingRaw('count(*) > 1');
            });
        }

        if (!empty($attributes['phone']) && $attributes['phone'] == 'true') {
            $this->model = $this->model->whereIn('phone', function ($query) {
                $query->select('customer_leads.phone')->from('customer_leads')->groupBy('customer_leads.phone')->havingRaw('count(*) > 1');
            });
        }

        if (!empty($attributes['children_full_name']) && $attributes['children_full_name'] == 'true') {
            $this->model = $this->model->whereHas('studentInfo', function ($query) {
                $query->whereIn('full_name', function ($q) {
                    $q->select('student_infos.full_name')->from('student_infos')->groupBy('student_infos.full_name')->havingRaw('count(*) > 1');
                });
            });
        }

        if (!empty($attributes['children_birth_date']) && $attributes['children_birth_date'] == 'true') {
            $this->model = $this->model->whereHas('studentInfo', function ($query) {
                $query->whereIn('birth_date', function ($q) {
                    $q->select('student_infos.birth_date')->from('student_infos')->groupBy('student_infos.birth_date')->havingRaw('count(*) > 1');
                });
            });
        }

        if (!empty($attributes['customer_lead_id'])) {
            $customer_lead_id = explode(',', $attributes['customer_lead_id']);
            $this->model = $this->model->whereIn('id', $customer_lead_id);
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

        if (!empty($attributes['studen_info'])) {
            if (!empty($mergeCustomerLead->studentInfo)) {
                $mergeCustomerLead->studentInfo()->forceDelete();
            }
            foreach ($attributes['studen_info'] as $value) {
                $value['customer_lead_id'] = $mergeCustomerLead->id;
                StudentInfo::create($value);
            }
        }
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

    public function moveToCustomerPotential(array $attributes)
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

        $customerLead = CustomerLead::whereIn('id', $attributes['id'])->get();
        foreach ($customerLead as $value) {
            $data = [
                'code' => $value->code,
                'full_name' => $value->full_name,
                'birth_date' => $value->birth_date,
                'sex' => $value->sex,
                'email' => $value->email,
                'phone' => $value->phone,
                'other_phone' => $value->other_phone,
                'address' => $value->address,
                'city_id' => $value->city_id,
                'district_id' => $value->district_id,
                'facility_id' => $value->facility_id,
                'employee_id' => $value->employee_id,
                'user_create_id' => $value->user_create_id,
                'user_create_info' => $value->user_create_info,
                'search_source_id' => $value->search_source_id,
                'facebook' => $value->facebook,
                'zalo' => $value->zalo,
                'instagram' => $value->instagram,
                'skype' => $value->skype,
                'name_company' => $value->name_company,
                'address_company' => $value->address_company,
                'phone_company' => $value->phone_company,
                'career' => $value->career,
                'file_image' => $value->file_image,
                'customer_lead_id' => $value->id
            ];
            $customerPotential = CustomerPotential::create($data);

            $student = StudentInfo::where('customer_lead_id', $value->id)->get();
            foreach ($student as $valueStudent) {
                $dataStudent = [
                    'full_name' => $valueStudent->full_name,
                    'birth_date' => $valueStudent->birth_date,
                    'sex' => $valueStudent->sex,
                    'month_age' => $valueStudent->month_age,
                    'relationship' => $valueStudent->relationship,
                    'file_image' => $valueStudent->file_image,
                    'customer_potential_id' => $customerPotential->id,
                ];
                PotentialStudentInfo::create($dataStudent);
            }

            $tag = CustomerTag::where('customer_lead_id', $value->id)->get();
            foreach ($tag as $valueTag) {
                $dataTag = [
                    'tag_id' => $valueTag->tag_id,
                    'customer_potential_id' => $customerPotential->id,
                ];

                CustomerPotentialTag::create($dataTag);
            }
        }

        return;
    }
}
