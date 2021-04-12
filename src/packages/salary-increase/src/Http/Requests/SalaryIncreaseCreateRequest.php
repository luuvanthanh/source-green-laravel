<?php

namespace GGPHP\SalaryIncrease\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SalaryIncreaseCreateRequest extends FormRequest
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
            'decision_number' => 'unique:salary_increases,decision_number',
            'decision_date' => 'required',
            'reason' => 'required',
            'employee_id' => 'required',
            'time_apply' => 'required',
            'note' => 'required',
        ];
    }
}
