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
            'EmployeeId' => 'required|exists:employees,id',
            'type' => 'required',
            'data' => 'array',
            'data.*.start_date' => 'required|date|date_format:Y-m-d',
            'data.*.EmployeeId' => 'required|exists:employees,id',
            'data.*.end_date' => 'required|date|date_format:Y-m-d|after_or_equal:data.*.start_date',
            'data.*.days' => 'nullable|numeric',
            'data.*.hours' => 'nullable|numeric',
            'data.*.reason' => 'required|string',
        ];
    }
}
