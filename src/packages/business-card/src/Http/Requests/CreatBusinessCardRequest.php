<?php

namespace GGPHP\BusinessCard\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatBusinessCardRequest extends FormRequest
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
            'absentTypeId' => 'required',
            'startDate' => 'required',
            'endDate' => 'required',
            'detail' => 'required|array',
        ];
    }
}
