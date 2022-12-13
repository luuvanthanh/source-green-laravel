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
            'sampleCommentId' => 'required|check_exists:study-program.SampleComments,Id',
            'status' => 'required|in:' . $status,
            'teacherId' => 'exists:Employees,Id',
            'TeacherManagementId' => 'exists:Employees,Id',
            'month' => 'date_format:Y-m-d'
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
