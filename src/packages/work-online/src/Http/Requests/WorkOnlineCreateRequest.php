<?php

namespace GGPHP\WorkOnline\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class WorkOnlineCreateRequest extends FormRequest
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
    public function rules(Request $request)
    {
        return [
            'absentTypeId' => 'required|exists:AbsentTypes,Id',
            'employeeId' => 'required|exists:Employees,Id',
            'startDate' => 'required|date|date_format:Y-m-d',
            'endDate' => 'required|date|date_format:Y-m-d|after_or_equal:startDate',
            'reason' => 'required|string',
            'detail' => 'required|array',
            'detail.*.date' => 'required|date|date_format:Y-m-d',
        ];
    }

    public function messages()
    {
        return [
            'endDate.after_or_equal' => "Trường thời gian kết thúc phải là một ngày sau hoặc bằng thời gian bắt đầu.",
        ];
    }
}
