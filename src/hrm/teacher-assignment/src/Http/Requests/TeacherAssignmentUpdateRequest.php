<?php

namespace GGPHP\TeacherAssignment\Http\Requests;

use GGPHP\TeacherAssignment\Models\TeacherAssignment;
use Illuminate\Foundation\Http\FormRequest;

class TeacherAssignmentUpdateRequest extends FormRequest
{
    /**
     * Determine if the employee is authorized to make this request.
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
            'employeeId' => 'exists:Employees,Id',
            'decisionNumber' => [
                'string',
                function ($attribute, $value, $fail) {
                    $teacherAssignment = TeacherAssignment::where('DecisionNumber', $value)->where('Id', '!=', request()->teacher_assignment)->first();

                    if (!is_null($teacherAssignment)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'decisionDate' => 'required|after_or_equal:today',
            'timeApply' => 'required|after_or_equal:decisionDate',
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'decisionDate.after_or_equal' => 'Trường phải là một ngày sau ngày hiện tại.',
            'timeApply.after_or_equal' => 'Trường phải là một ngày sau ngày quyết định.',
        ];
    }
}
