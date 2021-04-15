<?php

namespace GGPHP\SalaryIncrease\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SalaryIncreaseUpdateRequest extends FormRequest
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
            'decision_number' => 'unique:salaryIncreases,decision_number',
        ];
    }
}
