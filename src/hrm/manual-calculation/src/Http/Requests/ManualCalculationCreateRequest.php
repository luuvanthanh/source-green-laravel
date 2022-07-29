<?php

namespace GGPHP\ManualCalculation\Http\Requests;

use GGPHP\ManualCalculation\Models\ManualCalculation;
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
        $type = implode(',', array_keys(ManualCalculation::TYPE));
        return [
            'employeeId' => 'required|exists:Employees,Id',
            'date' => 'required|date_format:Y-m-d',
            'type' => 'required|in:' . $type,
        ];
    }
}
