<?php

namespace GGPHP\StudyProgram\MonthlyComment\Http\Requests;

use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyComment;
use Illuminate\Foundation\Http\FormRequest;

class MonthlyCommentCreateRequest extends FormRequest
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
        $status = implode(',', MonthlyComment::STATUS);
        return [
            'studentId' => 'required|check_exists:object.Students,Id',
            'schoolYearId' => 'required|check_exists:fee.SchoolYears,Id',
            'status' => 'required|in:' . $status,
            'teacherId' => 'exists:Employees,Id',
            'TeacherManagementId' => 'exists:Employees,Id',
            'month' => 'date_format:Y-m-d',
            'detail' => 'array',
            'detail.*.scriptReviewSubjectId' => 'nullable|check_exists:study-program.ScriptReviewSubjects,Id',
            'detail.*.scriptReviewCommentId' => 'nullable|check_exists:study-program.ScriptReviewComments,Id',
            'detail.*.detailSubject' => 'array',
            'detail.*.detailSubject.*.scriptReviewSubjectDetailId' => 'nullable|check_exists:study-program.ScriptReviewSubjectDetails,Id',
            'detail.*.detailSubject.*.detailSubjectChildren' => 'array',
            'detail.*.detailSubject.*.detailSubjectChildren.*.scriptReviewSubjectDetailChildrenId' => 'nullable|check_exists:study-program.ScriptReviewSubjectDetailChildrens,Id',
            'detail.*.detailSubject.*.detailSubjectChildren.*.evaluationCriteriaId' => 'nullable|check_exists:study-program.EvaluationCriterias,Id',
        ];
    }

    public function all($key = null)
    {
        $data = parent::all();

        if (!empty($data['status'])) {
            $data['status'] = MonthlyComment::STATUS[$data['status']];
        }

        return $data;
    }

    public function messages()
    {
        return [
            'check_exists' => 'The selected :attribute is invalid.',
            'boolean' => 'The :attribute field must be true or false.',
            'array' => 'The :attribute must be an array.',
            'exists' => 'The selected :attribute is invalid.',
            'in' => 'The selected :attribute is invalid.',
        ];
    }
}
