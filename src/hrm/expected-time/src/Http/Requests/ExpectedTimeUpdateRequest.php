<?php

namespace GGPHP\ExpectedTime\Http\Requests;

use GGPHP\ExpectedTime\Models\ExpectedTimeDetail;
use Illuminate\Foundation\Http\FormRequest;

class ExpectedTimeUpdateRequest extends FormRequest
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
            'employeeId' => 'nullable|exists:Employees,Id',
            'startDate' => 'nullable|date|date_format:Y-m-d',
            'endDate' => 'nullable|date|date_format:Y-m-d|after_or_equal:startDate',
            'detail' => 'array',
            'detail.*.teachingShiftId' => 'nullable|check_exists:distribution.TeachingShifts,Id',
            'detail.*.week' => 'array',
            'detail.*.week.*.type' => 'nullable|in:' . $week,
            'detail.*.week.*.isActive' => 'nullable|boolean',

        ];
    }
}
