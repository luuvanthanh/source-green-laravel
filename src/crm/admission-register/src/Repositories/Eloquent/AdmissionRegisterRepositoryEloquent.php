<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\AdmissionRegister\Presenters\AdmissionRegisterPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\AdmissionRegisterRepository;
use GGPHP\Crm\AdmissionRegister\Services\ParentInfoService;
use GGPHP\Crm\AdmissionRegister\Services\StudentService;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
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
            $this->model = $this->model->where('date_register', $attributes['date_register']);
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
            $customerLead = CustomerLead::where('id', $attributes['customer_lead_id'])->first();
            ParentInfoService::addParentInfo($admissionRegister->id, $customerLead);

            if (!empty($attributes['parent_info'])) {
                $admissionRegister->parentInfo()->create($attributes['parent_info']);
            }

            if (!is_null($customerLead)) {
                $studentClover = $this->createStudent($attributes, $admissionRegister, $customerLead->id);
                $admissionRegister->update(['student_clover_id' => $studentClover->student->id]);
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
            $admissionRegister = AdmissionRegister::find($id);
            $admissionRegister->update($attributes);

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
        switch ($customerLead->sex) {
            case 0:
                $customerLeadSex = 'FEMALE';
                break;
            case 1:
                $customerLeadSex = 'MALE';
                break;
            case 2:
                $customerLeadSex = 'OTHER';
                break;
            default:
                break;
        }
        $studentInfo = $customerLead->studentInfo->where('id', $attributes['student_info_id'])->first();
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
            'cardNumber' => '',
            'employeeUd' => null,
            'fullName' => !empty($studentInfo->full_name) ? $studentInfo->full_name : '',
            'sex' => $studentInfoSex,
            'dayOfBirth' => !empty($studentInfo->birth_date) ? $studentInfo->birth_date : '',
            'age' => $numberOfMonth,
            'address' => '',
            'street' => '',
            'city' => null,
            'district' => null,
            'ward' => null,
            'classId' => null,
            'studentCrmId' => $studentInfo->id,
            'health' => '',
            'registerDate' => Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d'),
            'laborNumber' => '',
            'startDate' => Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d'),
            'status' => 'REGISTED',
            'note' => !empty($admissionRegister->children_note) ? $admissionRegister->children_note : '',
            'parentWish' => !empty($admissionRegister->parent_wish) ? $admissionRegister->parent_wish : '',
            'source' => '',
            'comments' => '',
            'fileImage' => '',
        ];

        $data['fartherId'] = '00000000-0000-0000-0000-000000000000';
        $data['MotherId'] = '00000000-0000-0000-0000-000000000000';
        $data['father'] = [
            'employeeId' => null,
            'parentCrmId' => $customerLead->id,
            'code' => $customerLead->code,
            'fullName' => $customerLead->full_name,
            'sex' => $customerLeadSex,
            'dayOfBirth' => !empty($customerLead->birth_date) ? $customerLead->birth_date : '',
            'address' => !empty($customerLead->address) ? $customerLead->address : '',
            'street' => '',
            'city' => null,
            'district' => null,
            'ward' => null,
            'phone' => $customerLead->phone,
            'anotherPhone' => !empty($customerLead->other_phone) ? $customerLead->other_phone : '',
            'email' => $customerLead->email,
            'zalo' => '',
            'faceBook' => '',
            'instagram' => '',
            'hobby' => '',
            'referent' => '',
            'source' => '',
            'status' => 'REGISTED',
            'jobTile' => '',
            'fileImage' => !empty($customerLead->file_image) ? $customerLead->file_image : '',
        ];

        $data['mother'] = null;
        $data['motherAccount'] = null;
        $data['fatherAccount'] = null;

        return StudentService::createStudent($data);
    }
}
