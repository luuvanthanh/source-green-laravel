<?php

namespace GGPHP\ManualCalculation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CopyManualCalculationCreateRequest extends FormRequest
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
            'employeeId' => 'array|required|exists:ManualCalculations,EmployeeId',
            'month' => 'required|date_format:Y-m-d',
            'startDate' => 'required|date_format:Y-m-d',
            'endDate' => 'required|date_format:Y-m-d|after:startDate'
        ];
    }
}
