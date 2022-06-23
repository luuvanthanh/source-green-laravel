<?php

namespace GGPHP\ManualCalculation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManualCalculationCreateRequest extends FormRequest
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
            'employeeId' => 'required|exists:Employees,Id',
            'date' => 'required|date_format:Y-m-d',
            'type' => 'required|in:X,F,K,N,X/2',
        ];
    }
}
