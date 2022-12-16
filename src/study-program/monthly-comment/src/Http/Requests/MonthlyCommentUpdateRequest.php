<?php

namespace GGPHP\StudyProgram\MonthlyComment\Http\Requests;

use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyComment;
use Illuminate\Foundation\Http\FormRequest;

class MonthlyCommentUpdateRequest extends FormRequest
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
            'studentId' => 'check_exists:object.Students,Id',
            'schoolYearId' => 'check_exists:fee.SchoolYears,Id',
            'status' => 'in:' . $status,
            'teacherId' => 'exists:Employees,Id',
            'TeacherManagementId' => 'exists:Employees,Id',
            'month' => 'date_format:Y-m-d',
            'detail.*.scriptReviewCommentId' => 'nullable|check_exists:study-program.ScriptReviewComments,Id',
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
}
