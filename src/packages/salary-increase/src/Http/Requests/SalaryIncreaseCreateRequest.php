<?php

namespace GGPHP\SalaryIncrease\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SalaryIncreaseCreateRequest extends FormRequest
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
            'decisionNumber' => 'unique:SalaryIncreases,DecisionNumber',
            'decisionDate' => 'required',
            'reason' => 'required',
            'employeeId' => 'required',
            'timeApply' => 'required',
            'note' => 'required',
        ];
    }
}
