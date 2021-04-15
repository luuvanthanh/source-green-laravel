<?php

namespace GGPHP\ResignationDecision\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResignationDecisionCreateRequest extends FormRequest
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
            'DecisionNumber' => 'unique:resignation_decisions,DecisionNumber',
            'DecisionDate' => 'required',
            'EmployeeId' => 'required',
            'time_apply' => 'required',
            'pay_end_date' => 'required',
        ];
    }
}
