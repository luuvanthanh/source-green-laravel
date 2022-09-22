<?php

namespace GGPHP\Salary\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetPayrollSessionRequest extends FormRequest
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
            'month' => 'required|date_format:Y-m-d',
        ];
    }
}
