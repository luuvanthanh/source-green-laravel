<?php

namespace GGPHP\ExpectedTime\Http\Requests;

use GGPHP\ExpectedTime\Models\ExpectedTimeDetail;
use Illuminate\Foundation\Http\FormRequest;

class ExpectedTimeCreateRequest extends FormRequest
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
        $week =implode(',', array_keys(ExpectedTimeDetail::WEEK));

        return [
            'employeeId' => 'required|exists:Employees,Id',
            'startDate' => 'required|date|date_format:Y-m-d',
            'endDate' => 'required|date|date_format:Y-m-d|after_or_equal:startDate',
            'detail' => 'array',
            'detail.*.teachingShiftId' => 'required|check_exists:distribution.TeachingShifts,Id',
            'detail.*.week' => 'array',
            'detail.*.week.*.type' => 'required|in:' . $week,
            'detail.*.week.*.isActive' => 'required|boolean',

        ];
    }

    public function messages()
    {
        return [
            'endDate.after_or_equal' => 'Trường đến ngày phải bắt đầu sau hoặc đúng bằng ngày khởi hành'
        ];
    }
}
