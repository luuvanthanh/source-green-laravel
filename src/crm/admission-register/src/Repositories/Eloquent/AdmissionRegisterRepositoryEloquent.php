<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\AdmissionRegister\Presenters\AdmissionRegisterPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\AdmissionRegisterRepository;
use GGPHP\Crm\AdmissionRegister\Services\ParentInfoService;
use GGPHP\Crm\AdmissionRegister\Services\StudentService;
use GGPHP\Crm\Category\Models\StatusParentPotential;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerLeadRepository;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialStatusCare;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AdmissionRegisterRepositoryEloquent extends BaseRepository implements AdmissionRegisterRepository
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
        return AdmissionRegister::class;
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
        return AdmissionRegisterPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('studentInfo', function ($query) use ($attributes) {
                $query->whereLike('full_name', $attributes['key']);
            });
        }

        if (!empty($attributes['customer_lead_id'])) {
            $this->model = $this->model->whereHas('studentInfo', function ($query) use ($attributes) {
                $query->where('customer_lead_id', $attributes['customer_lead_id']);
            });
        }

        if (isset($attributes['register_status'])) {
            $status = AdmissionRegister::REGISTER_STATUS[$attributes['register_status']];
            $this->model = $this->model->where('register_status', $status);
        }

        if (!empty($attributes['birth_date'])) {
            $this->model = $this->model->whereHas('studentInfo', function ($query) use ($attributes) {
                $query->where('birth_date', $attributes['birth_date']);
            });
        }

        if (!empty($attributes['parent_info_id'])) {
            $this->model = $this->model->whereHas('parentInfo', function ($query) use ($attributes) {
                $query->where('id', $attributes['parent_info_id']);
            });
        }

        if (!empty($attributes['date_register'])) {
            $this->model = $this->model->whereDate('date_register', $attributes['date_register']);
        }

        if (!empty($attributes['student_info_id'])) {
            $this->model = $this->model->where('student_info_id', $attributes['student_info_id']);
        }

        if (!empty($attributes['status_admission_register_id'])) {
            $this->model = $this->model->whereHas('statusAdmissionRegister', function ($query) use ($attributes) {
                $query->where('id', $attributes['status_admission_register_id']);
            });
        }

        if (!empty($attributes['customer_lead_id'])) {
            $this->model = $this->model->whereHas('studentInfo', function ($query) use ($attributes) {
                $query->where('customer_lead_id', $attributes['customer_lead_id']);
            });
        }

        if (!empty($attributes['limit'])) {
            $admissionRegister = $this->paginate($attributes['limit']);
        } else {
            $admissionRegister = $this->get();
        }

        return $admissionRegister;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $admissionRegister = AdmissionRegister::create($attributes);

            if (!empty($attributes['parent_info'])) {
                $admissionRegister->parentInfo()->create($attributes['parent_info']);
            }

            $customerLead = CustomerLead::where('id', $attributes['customer_lead_id'])->first();

            if (!is_null($customerLead)) {
                ParentInfoService::addParentInfo($admissionRegister->id, $customerLead);
                $studentClover = $this->createStudent($attributes, $admissionRegister, $customerLead->id);
                $admissionRegister->update([
                    'student_clover_id' => $studentClover->student->id,
                    'student_clover_code' => $studentClover->student->code,
                ]);
            }

            $customerPotential = CustomerPotential::where('customer_lead_id', $attributes['customer_lead_id'])->first();

            if (!is_null($customerPotential)) {
                $statusParentPotential = StatusParentPotential::where('number', StatusParentPotential::NUMBER_STATUS['ADMISSION_REGISTER'])->first();
                $customerPotentialStatusCare = CustomerPotentialStatusCare::where('status_parent_potential_id', $statusParentPotential->id)->first();

                if (is_null($customerPotentialStatusCare)) {
                    $customerPotential->customerPotentialStatusCare()->create(['status_parent_potential_id' => $statusParentPotential->id]);
                }
            } else {
                $attributes['id'] = $attributes['customer_lead_id'];
                $customerPotential = resolve(CustomerLeadRepository::class)->moveToCustomerPotential($attributes);

                $statusParentPotential = StatusParentPotential::where('number', StatusParentPotential::NUMBER_STATUS['ADMISSION_REGISTER'])->first();
                $customerPotential->customerPotentialStatusCare()->create(['status_parent_potential_id' => $statusParentPotential->id]);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return $this->parserResult($admissionRegister);
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $admissionRegister = AdmissionRegister::findOrfail($id);
            $admissionRegister->update($attributes);

            if ($admissionRegister->register_status == AdmissionRegister::REGISTER_STATUS['CANCEL_REGISTER']) {
                if (!is_null($admissionRegister->student_clover_id)) {
                    StudentService::deleteStudent($admissionRegister->student_clover_id);
                }
            }

            if (!empty($attributes['parent_info'])) {
                $parent = ParentInfo::where('admission_register_id', $id)->where('customer_lead_id', null)->first();
                $parent->update($attributes['parent_info']);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }

    public function createStudent(array $attributes, $admissionRegister, $id)
    {
        $customerLead = CustomerLead::find($id);
        $studentInfo = $customerLead->studentInfo()->where('id', $attributes['student_info_id'])->first();
        $birthday = Carbon::parse($studentInfo->birth_date);
        $now = Carbon::parse(Carbon::now('Asia/Ho_Chi_Minh'));
        $numberOfMonth = $birthday->diffInMonths($now);

        switch ($studentInfo->sex) {
            case 0:
                $studentInfoSex = 'FEMALE';
                break;
            case 1:
                $studentInfoSex = 'MALE';
                break;
            case 2:
                $studentInfoSex = 'OTHER';
                break;
            default:
                break;
        }

        $customerLeadAccount = $customerLead->ssoAccount;
        $data['student'] = [
            'code' => 'CrmStudent',
            'fullName' => !empty($studentInfo->full_name) ? $studentInfo->full_name : '',
            'sex' => $studentInfoSex,
            'dayOfBirth' => !empty($studentInfo->birth_date) ? $studentInfo->birth_date : '',
            'age' => $numberOfMonth,
            'studentCrmId' => $studentInfo->id,
            'registerDate' => $admissionRegister->date_register,
            'startDate' => Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d'),
            'status' => 'REGISTED',
            'note' => !empty($admissionRegister->children_note) ? $admissionRegister->children_note : '',
            'parentWish' => !empty($admissionRegister->parent_wish) ? $admissionRegister->parent_wish : '',
            'fileImage' => '',
            'branchId' => $admissionRegister->branch->branch_id_hrm,
        ];

        return StudentService::createStudent($data);
    }
}
