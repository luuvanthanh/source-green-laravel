<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\CallCenter\Models\ManagerCall;
use GGPHP\Crm\CallCenter\Repositories\Contracts\ManagerCallRepository;
use GGPHP\Crm\Category\Models\StatusParentPotential;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\CustomerTag;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use GGPHP\Crm\CustomerLead\Presenters\CustomerLeadPresenter;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerLeadRepository;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialStatusCare;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialTag;
use GGPHP\Crm\CustomerPotential\Models\PotentialStudentInfo;
use GGPHP\Crm\SsoAccount\Models\SsoAccount;
use GGPHP\Crm\SsoAccount\Repositories\Eloquent\SsoAccountRepositoryEloquent;
use GGPHP\Crm\SsoAccount\Services\SsoService;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;
use Symfony\Component\HttpKernel\Exception\HttpException;

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

        if (!empty($attributes['employee_id']) && $attributes['employee_id'] != 'null') {
            $this->model = $this->model->where('employee_id', $attributes['employee_id']);
        }

        if (!empty($attributes['call_times'])) {
            if ($attributes['call_times'] == 'FIRST') {
                $this->model = $this->model->whereHas('managerCall', function ($query) use ($attributes) {
                    $query->where(function ($query) use ($attributes) {
                        $query->select('call_times');
                        $query->from('manager_calls');
                        $query->whereColumn('customer_lead_id', 'customer_leads.id');
                        $query->latest();
                        $query->limit(1);

                        if (!empty($attributes['employee_id'])) {
                            $query->where('employee_id', $attributes['employee_id']);
                        }
                    }, '=', ManagerCall::CALLTIME['YET_CREATE']);
                })->with(['managerCall' => function ($query) use ($attributes) {
                    $query->where('call_times', ManagerCall::CALLTIME['YET_CREATE']);

                    if (!empty($attributes['employee_id'])) {
                        $query->where('employee_id', $attributes['employee_id']);
                        $query->latest();
                        $query->limit(1);
                    }
                }]);
            } else {
                $this->model = $this->model->whereHas('managerCall', function ($query) use ($attributes) {
                    $query->where(function ($query) use ($attributes) {
                        $query->select('call_times');
                        $query->from('manager_calls');
                        $query->whereColumn('customer_lead_id', 'customer_leads.id');
                        $query->latest();
                        $query->limit(1);

                        if (!empty($attributes['employee_id'])) {
                            $query->where('employee_id', $attributes['employee_id']);
                        }
                    }, ManagerCall::CALLTIME[$attributes['call_times']] - 1);
                })->with(['managerCall' => function ($query) use ($attributes) {
                    $query->where('call_times', ManagerCall::CALLTIME[$attributes['call_times']] - 1);

                    if (!empty($attributes['employee_id'])) {
                        $query->where('employee_id', $attributes['employee_id']);
                        $query->latest();
                        $query->limit(1);
                    }
                }]);
            }
        }

        if (!empty($attributes['tag_id'])) {
            $this->model = $this->model->whereHas('customerTag', function ($query) use ($attributes) {
                $query->where('tag_id', $attributes['tag_id']);
            });
        }

        if (!empty($attributes['employee_id']) && $attributes['employee_id'] == 'null') {
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

        if (!empty($attributes['status_customer_lead']) && $attributes['status_customer_lead'] == 'false') {
            $this->model = $this->model->whereDoesntHave('statusCare');
        }

        if (isset($attributes['status_lead'])) {
            $this->model = $this->model->whereHas('statusLead', function ($query) use ($attributes) {
                $query->where(function ($query) {
                    $query->select('status');
                    $query->from('status_lead');
                    $query->whereColumn('customer_lead_id', 'customer_leads.id');
                    $query->orderBy('created_at', 'desc');
                    $query->limit(1);
                }, $attributes['status_lead']);
            });
        }

        if (!empty($attributes['status_type_lead'])) {
            $this->model = $this->model->whereHas('statusCare', function ($query) use ($attributes) {
                $query->where(function ($query) {
                    $query->select('status_parent_lead_id');
                    $query->from('status_cares');
                    $query->whereColumn('customer_lead_id', 'customer_leads.id');
                    $query->orderBy('created_at', 'desc');
                    $query->limit(1);
                }, $attributes['status_type_lead']);
            });
        }

        if (!empty($attributes['status_parent_potential_id'])) {
            $this->model = $this->model->whereHas('customerPotential.customerPotentialStatusCareLatest', function ($query) use ($attributes) {
                $query->where(function ($query) {
                    $query->select('status_parent_potential_id');
                    $query->from('customer_potential_status_cares');
                    $query->whereColumn('customer_potential_id', 'customer_potentials.id');
                    $query->latest();
                    $query->limit(1);
                }, $attributes['status_parent_potential_id']);
            });
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

            //tạo lịch gọi
            $check = ManagerCall::where([
                ['customer_lead_id', $value['customer_lead_id']],
                ['employee_id', $value['employee_id']]
            ])->first();

            $data = array();

            if (is_null($check)) {
                $data['employee_id'] = $value['employee_id'];
                $data['list_customer_lead'][] = ['customer_lead_id' => $value['customer_lead_id']];
                $data['receive_date'] = now()->toDateString();
                $data['call_times'] = array_search(null, ManagerCall::CALLTIME);

                resolve(ManagerCallRepository::class)->create($data);
            }
        }

        return parent::parserResult($customerLead);
    }

    public function mergeCustomerLead($attributes)
    {
        $mergeCustomerLead = CustomerLead::whereIn('id', $attributes['merge_customer_lead_id'])->where('user_facebook_info_id', '!=', null)->first();

        if (is_null($mergeCustomerLead)) {
            $mergeCustomerLead = CustomerLead::whereIn('id', $attributes['merge_customer_lead_id'])->orderBy('created_at', 'DESC')->first();
        }

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
            $attributes['code'] = CustomerLead::CODE . $now . '01';
        } else {

            if (substr($customerLead_code, 2, 8)  != $now) {
                $attributes['code'] = CustomerLead::CODE . $now . '01';
            } else {
                $stt = substr($customerLead_code, 2) + 1;
                $attributes['code'] = CustomerLead::CODE . $stt;
            }
        }
        $attributes['manual_create'] = true;
        $customerLead = CustomerLead::create($attributes);
        $customerLead->statusLead()->create(['status' => StatusLead::STATUS_LEAD['LEAD_NEW']]);

        return $this->parserResult($customerLead);
    }

    public function moveToCustomerPotential(array $attributes)
    {
        $customerLead = CustomerLead::where('id', $attributes['id'])->first();

        if (!is_null($customerLead)) {
            $this->updateStatusEmail($customerLead->id);
        }

        $data = [
            'code' => $customerLead->code,
            'full_name' => $customerLead->full_name,
            'birth_date' => $customerLead->birth_date,
            'sex' => $customerLead->sex,
            'email' => $customerLead->email,
            'phone' => $customerLead->phone,
            'other_phone' => $customerLead->other_phone,
            'address' => $customerLead->address,
            'city_id' => $customerLead->city_id,
            'district_id' => $customerLead->district_id,
            'facility_id' => $customerLead->facility_id,
            'employee_id' => $customerLead->employee_id,
            'user_create_id' => $customerLead->user_create_id,
            'user_create_info' => $customerLead->user_create_info,
            'search_source_id' => $customerLead->search_source_id,
            'facebook' => $customerLead->facebook,
            'zalo' => $customerLead->zalo,
            'instagram' => $customerLead->instagram,
            'skype' => $customerLead->skype,
            'name_company' => $customerLead->name_company,
            'address_company' => $customerLead->address_company,
            'phone_company' => $customerLead->phone_company,
            'career' => $customerLead->career,
            'file_image' => $customerLead->file_image,
            'customer_lead_id' => $customerLead->id,
        ];
        $customerPotential = CustomerPotential::create($data);
        $customerLead->update(['flag_move_potential' => true]);

        $tag = CustomerTag::where('customer_lead_id', $customerLead->id)->get();
        foreach ($tag as $value) {
            $dataTag = [
                'tag_id' => $value->tag_id,
                'customer_potential_id' => $customerPotential->id,
            ];
            CustomerPotentialTag::create($dataTag);
        }

        if (!empty($attributes['statusPotential'])) {
            $statusPotential = StatusParentPotential::find($attributes['statusPotential']);
            $data = [
                'status_parent_potential_id' => $statusPotential->id,
                'customer_potential_id' => $customerPotential->id,
            ];
            CustomerPotentialStatusCare::create($data);
        }

        return $customerPotential;
    }

    public function storeCareProgram($attributes)
    {
        if (!empty($attributes['marketing_program'])) {
            $customerLead = CustomerLead::find($attributes['customer_lead_id']);
            $customerLead->marketingProgram()->detach();
            foreach ($attributes['marketing_program'] as $value) {
                $customerLead->marketingProgram()->attach($value['marketing_program_id']);
            }
        } else {
            $customerLead = CustomerLead::find($attributes['customer_lead_id']);
            $customerLead->marketingProgram()->detach();
        }

        return parent::parserResult($customerLead);
    }

    public function updateStatusEmail($id)
    {
        $url_email = env('EMAIL_URL') . '/api/v1/subscribers/';
        $bearerToken = env('TOKEN_EMAIL');
        $response = Http::withToken($bearerToken)->get($url_email);
        $email = $response->json();

        if (!is_null($email)) {

            foreach ($email['data'] as $value) {

                if ($value['customer_lead_id'] == $id) {
                    $url = $url_email . $value['id'];
                    $response = Http::withToken($bearerToken)->put($url, ['customer_group' => '1']);

                    if ($response->failed()) {
                        $message = 'Có lỗi từ api Email Marketing';

                        if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                            $message = 'Email Marketing: ' . json_decode($response->body())->error->message;
                        }
                        throw new HttpException($response->status(), $message);
                    }
                }
            }
        }

        return true;
    }

    public function customerLeadAccount($attributes)
    {
        \DB::beginTransaction();
        try {
            $customerLead =  CustomerLead::findOrFail($attributes['customer_lead_id']);

            $attributes['model_id'] = $attributes['customer_lead_id'];
            $attributes['model_type'] = CustomerLead::class;

            $ssoAcount = SsoAccount::create($attributes);

            $dataSsoAcount = [
                'userName' => $ssoAcount->user_name,
                'fullName' => $customerLead->full_name,
                'phoneNumber' => $customerLead->phone,
                'password' => $attributes['password'],
                'email' => $ssoAcount->email
            ];

            $ssoAcountLead = SsoService::createLeadAccount($dataSsoAcount);
            $ssoAcount->update([
                'sso_user_id' => $ssoAcountLead->result->id
            ]);

            \DB::commit();

            return resolve(SsoAccountRepositoryEloquent::class)->parserResult($ssoAcount);
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
    }

    public function findCustomerLead($id)
    {
        $ssoAccount = SsoAccount::where('sso_user_id', $id)->first();

        if (is_null($ssoAccount)) {
            return [];
        }

        $customerLead = CustomerLead::where('id', $ssoAccount->model_id)->first();

        return $this->parserResult($customerLead);
    }

    public function customerByPhone($phone)
    {
        $customer = $this->model->where(function ($query) use ($phone) {
            $query->where('phone', $phone)->orWhere('other_phone', $phone);
        })->first();

        if (!is_null($customer)) {
            return $this->parserResult($customer);
        }

        return ['data' => []];
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $customerLead = CustomerLead::find($id);
            $customerLead->update($attributes);

            $customerPotential = CustomerPotential::where('customer_lead_id', $customerLead->id)->first();

            if (!is_null($customerPotential)) {
                $customerPotential->update($attributes);
            }
            $parentInfo = ParentInfo::where('customer_lead_id', $customerLead->id)->get();

            if (!empty($parentInfo)) {
                foreach ($parentInfo as $value) {
                    $value->update($attributes);
                }
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return $this->parserResult($customerLead);
    }
}
