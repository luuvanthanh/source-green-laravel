<?php

namespace GGPHP\Timekeeping\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatTimekeepingRequest extends FormRequest
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
            'employee_id' => 'required|exists:employees,id',
            'device_id' => 'required|exists:fingerprint_timekeepers,id',
            'type' => 'required|string|in:' . $type,
            'tracking_type' => 'required|string|in:' . $trackingType,
            'attended_at' => 'required|date|date_format:Y-m-d H:i:s',
        ];
    }
}
