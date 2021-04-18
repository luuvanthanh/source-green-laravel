<?php

namespace GGPHP\AddSubTime\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddSubTimeCreateRequest extends FormRequest
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
            'type' => 'required',
            'data' => 'array',
            'data.*.startDate' => 'required|date|date_format:Y-m-d',
            'data.*.employeeId' => 'required|exists:Employees,Id',
            'data.*.endDate' => 'required|date|date_format:Y-m-d|after_or_equal:Data.*.StartDate',
            'data.*.days' => 'nullable|numeric',
            'data.*.hours' => 'nullable|numeric',
            'data.*.reason' => 'required|string',
        ];
    }
}
