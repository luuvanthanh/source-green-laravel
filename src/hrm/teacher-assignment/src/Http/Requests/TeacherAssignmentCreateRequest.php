<?php

namespace GGPHP\TeacherAssignment\Http\Requests;

use Carbon\Carbon;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\TeacherAssignment\Models\TeacherAssignment;
use Illuminate\Foundation\Http\FormRequest;

class TeacherAssignmentCreateRequest extends FormRequest
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
            'branchId' => 'required',
            'classesId' => 'required',
            'decisionNumber' => 'unique:TeacherAssignments,DecisionNumber',
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
