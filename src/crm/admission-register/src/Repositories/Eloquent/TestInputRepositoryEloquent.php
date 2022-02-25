<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\AdmissionRegister\Models\TestInput;
use GGPHP\Crm\AdmissionRegister\Models\TestInputDetail;
use GGPHP\Crm\AdmissionRegister\Models\TestInputDetailChildren;
use GGPHP\Crm\AdmissionRegister\Presenters\TestInputPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\TestInputRepository;
use GGPHP\Crm\AdmissionRegister\Services\StudentService;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use GGPHP\Crm\Fee\Models\ClassType;
use GGPHP\Crm\SsoAccount\Models\SsoAccount;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TestInputRepositoryEloquent extends BaseRepository implements TestInputRepository
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
        return TestInput::class;
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
        return TestInputPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['admission_register_id'])) {
            $this->model = $this->model->where('admission_register_id', $attributes['admission_register_id']);
        }

        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('status', $attributes['status']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('admissionRegister', function ($q) use ($attributes) {
                $q->whereHas('studentInfo', function ($query) use ($attributes) {
                    $query->whereLike('full_name', $attributes['key']);
                });
            });
        }

        if (!empty($attributes['branch_id'])) {
            $this->model = $this->model->where('branch_id', $attributes['branch_id']);
        }

        if (!empty($attributes['employee_id'])) {
            $this->model = $this->model->where('employee_id', $attributes['employee_id']);
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('created_at', '>=', $attributes['startDate'])->where('created_at', '<=', $attributes['endDate']);
        }

        if (isset($attributes['age'])) {
            $this->model = $this->model->whereHas('testInputDetail', function ($q) use ($attributes) {
                $q->whereHas('testInputDetailChildren', function ($q1) use ($attributes) {
                    $q1->whereHas('childEvaluate', function ($query) use ($attributes) {
                        $query->where('age', $attributes['age']);
                    });
                });
            });
        }

        if (isset($attributes['approval_status'])) {
            $this->model = $this->model->where('approval_status', $attributes['approval_status']);
        }

        if (!empty($attributes['class_type_id'])) {
            $this->model = $this->model->where('class_type_id', $attributes['class_type_id']);
        }

        if (!empty($attributes['limit'])) {
            $testInput = $this->paginate($attributes['limit']);
        } else {
            $testInput = $this->get();
        }

        return $testInput;
    }

    public function createOrUpdate(array $attributes)
    {
        $testInput = TestInput::where('admission_register_id', $attributes['admission_register_id'])->first();

        if (is_null($testInput)) {
            $testInput = TestInput::create($attributes);
        }

        if (!is_null($testInput)) {
            $testInput->update($attributes);
        }

        return parent::all();
    }

    public function testInputDetail(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $testInput = TestInput::where('admission_register_id', $attributes['admission_register_id'])->first();

            if (is_null($testInput->time_age)) {
                $studentInfo = AdmissionRegister::find($testInput->admission_register_id);
                $dateOfBirth = $studentInfo->studentInfo->birth_date;
                $birthday = Carbon::parse($dateOfBirth);
                $today = Carbon::parse(Carbon::now('Asia/Ho_Chi_Minh'));
                $numberOfMonth = $birthday->diffInMonths($today);
                $testInput->time_age = $numberOfMonth;
            }

            if (!empty($attributes['detail'])) {

                TestInputDetail::where('category_skill_id', $attributes['detail']['category_skill_id'])->delete();
                $attributes['detail']['test_input_id'] = $testInput->id;
                $attributes['detail']['status'] = TestInputDetail::STATUS[$attributes['detail']['status']];
                $attributes['detail']['serial_number'] = TestInputDetail::max('serial_number') + 1;
                
                if (!empty($attributes['detail']['is_check'])) {

                    $testInputDetail = TestInputDetail::create($attributes['detail']);
                    foreach ($attributes['detail']['is_check'] as $value) {
                        $value['test_input_detail_id'] = $testInputDetail->id;
                        TestInputDetailChildren::create($value);
                    }
                }
            }

            $testInput->status = TestInput::STATUS[$attributes['status']];
            $testInput->update();

            if (TestInput::STATUS[$attributes['status']] == 3) {
                $testInput->testInputDetail()->delete();
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($testInput->id);
    }

    public function moveStudentToOfficial($id)
    {
        $data = [];
        $testInput = TestInput::find($id);
        $admissionRegister = AdmissionRegister::find($testInput->admission_register_id);
        $studentInfo = StudentInfo::find($admissionRegister->student_info_id);

        switch ($studentInfo->sex) {
            case 0:
                $sex = 'FEMALE';
                break;
            case 1:
                $sex = 'MALE';
                break;
            case 2:
                $sex = 'OTHER';
                break;
            default:
                break;
        }

        $birthday = Carbon::parse($studentInfo->birth_date);
        $now = Carbon::parse(Carbon::now('Asia/Ho_Chi_Minh'));
        $numberOfMonth = $birthday->diffInMonths($now);
        $customerLead = CustomerLead::find($studentInfo->customer_lead_id);

        switch ($customerLead->sex) {
            case 0:
                $sex = 'FEMALE';
                break;
            case 1:
                $sex = 'MALE';
                break;
            case 2:
                $sex = 'OTHER';
                break;
            default:
                break;
        }

        $data['studentInfo']['FatherAccount'] = null;
        $customerLeadAccount = SsoAccount::where('model_id', $customerLead->id)->first();

        if (!is_null($customerLeadAccount)) {
            $data['studentInfo']['FatherAccount'] = [
                'AppUserId' => $customerLeadAccount->sso_user_id,
                'UserName' => $customerLeadAccount->user_name,
                'FaceImageStatus' => ''
            ];
        }

        $data['studentInfo']['student'] = [
            'code' => 'CrmStudent',
            'cardNumber' => '',
            'employeeUd' => null,
            'fullName' => !empty($studentInfo->full_name) ? $studentInfo->full_name : '',
            'sex' => $sex,
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
            'fileImage' => !empty($studentInfo->file_image) ? $studentInfo->file_image : '',
        ];
        $data['studentInfo']['fartherId'] = '00000000-0000-0000-0000-000000000000';
        $data['studentInfo']['MotherId'] = '00000000-0000-0000-0000-000000000000';
        $data['studentInfo']['father'] = [
            'employeeId' => null,
            'parentCrmId' => $customerLead->id,
            'code' => $customerLead->code,
            'fullName' => $customerLead->full_name,
            'sex' => $sex,
            'dayOfBirth' => !empty($customerLead->birth_date) ? $customerLead->birth_date : '',
            'address' => !empty($customerLead->address) ? $customerLead->address : '',
            'street' => null,
            'city' => null,
            'district' => null,
            'ward' => null,
            'phone' => $customerLead->phone,
            'anotherPhone' => !empty($customerLead->other_phone) ? $customerLead->other_phone : '',
            'email' => $customerLead->email,
            'zalo' => null,
            'faceBook' => null,
            'instagram' => null,
            'hobby' => null,
            'referent' => null,
            'source' => null,
            'status' => 'REGISTED',
            'jobTile' => null,
            'fileImage' => !empty($testInput->file_image) ? $testInput->file_image : '',
        ];
        $data['studentInfo']['mother'] = null;
        $data['studentInfo']['MotherAccount'] = null;

        $data['testInput'] = [
            'strength' => !empty($testInput->strength) ? $testInput->strength : '',
            'encourage' => !empty($testInput->encourage) ? $testInput->encourage : '',
            'timeAgeTestSemester' => !empty($testInput->time_age) ? $testInput->time_age : '',
        ];
        $data['testInput']['detail'] = [];
        foreach ($testInput->testInputDetail as $value) {
            foreach ($value->testInputDetailChildren as $valueChildren) {

                if (!array_key_exists($value->id, $data['testInput']['detail'])) {
                    $data['testInput']['detail'][$valueChildren->test_input_detail_id] = [
                        'categorySkillId' => $value->category_skill_id,
                        'isCheck' => [
                            [
                                'childEvaluateId' => $valueChildren->child_evaluate_id,
                                'childEvaluateDetailId' => $valueChildren->child_evaluate_detail_id,
                                'childEvaluateDetailChildrenId' => $valueChildren->child_evaluate_detail_children_id,
                            ]
                        ]
                    ];
                } else {
                    $data['testInput']['detail'][$valueChildren->test_input_detail_id]['isCheck'][] = [
                        'childEvaluateId' => $valueChildren->child_evaluate_id,
                        'childEvaluateDetailId' => $valueChildren->child_evaluate_detail_id,
                        'childEvaluateDetailChildrenId' => $valueChildren->child_evaluate_detail_children_id,
                    ];
                }
            }
        }
        $result = StudentService::moveStudentToOfficial($data);

        return $result;
    }
}
