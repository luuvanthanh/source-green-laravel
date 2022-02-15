<?php

namespace GGPHP\WorkOnline\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class WorkOnlineUpdateRequest extends FormRequest
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
            'absentTypeId' => 'exists:AbsentTypes,Id',
            'employeeId' => 'exists:Employees,Id',
            'startDate' => 'date|date_format:Y-m-d',
            'endDate' => 'date|date_format:Y-m-d|after_or_equal:startDate',
            'reason' => 'string',
            'detail' => 'array',
            'detail.*.date' => 'date|date_format:Y-m-d',
        ];
    }

    public function messages()
    {
        return [
            'endDate.after_or_equal' => 'Trường thời gian kết thúc phải là một ngày sau hoặc bằng thời gian bắt đầu.',
        ];
    }
}
