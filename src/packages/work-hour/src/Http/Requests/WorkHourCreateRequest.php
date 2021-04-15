<?php

namespace GGPHP\WorkHour\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatWorkHourRequest extends FormRequest
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
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'hours' => 'required',
        ];
    }
}
