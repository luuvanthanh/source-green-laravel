<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\Interviewer;
use Illuminate\Foundation\Http\FormRequest;

class InterviewerCreateRequest extends FormRequest
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
            'divisionId' => 'required|exists:Divisions,Id|unique:Interviewers,DivisionId',
            'employeeId' => 'required|array',
            'employeeId.*' => 'required|exists:Employees,Id'
        ];
    }
}
