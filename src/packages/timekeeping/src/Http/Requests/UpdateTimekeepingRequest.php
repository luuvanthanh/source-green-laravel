<?php

namespace GGPHP\Timekeeping\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTimekeepingRequest extends FormRequest
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
        $type = implode(',', config('constants-timekeeping.TYPE.COLLECTIONS'));
        $trackingType = implode(',', config('constants-timekeeping.TRACKING_TYPE.COLLECTIONS'));

        return [
            'employeeId' => 'required|exists:Employees,Id',
            'deviceId' => 'required|exists:fingerprint_timekeepers,Id',
            'type' => 'required|string|in:' . $type,
            'trackingType' => 'required|string|in:' . $trackingType,
            'attendedAt' => 'required|date|date_format:Y-m-d H:i:s',
        ];
    }
}
