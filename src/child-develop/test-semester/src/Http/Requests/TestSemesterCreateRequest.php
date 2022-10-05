<?php

namespace GGPHP\ChildDevelop\TestSemester\Http\Requests;

use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetail;
use Illuminate\Foundation\Http\FormRequest;

class TestSemesterCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'assessmentPeriodId' => 'required|exists:AssessmentPeriods,Id',
            'studentId' => 'required|check_exists:object.Students,Id',
            'status' => 'required|in:' . implode(',', array_keys(TestSemester::STATUS)),
            'detail' => 'array',
            'detail.isCheck' => 'array',
            'detail.categorySkillId' => 'exists:CategorySkills,Id',
            'detail.status' => 'in:' . implode(',', array_keys(TestSemesterDetail::STATUS)),
            'detail.isCheck.*.score' => 'numeric',
            'detail.isCheck.*.childEvaluateId' => 'exists:ChildEvaluates,Id',
            'detail.isCheck.*.childEvaluateDetailId' => 'exists:ChildEvaluateDetails,Id',
            'detail.isCheck.*.childEvaluateDetailChildrenId' => 'exists:ChildEvaluateDetailChildrens,Id'
        ];
    }
}
