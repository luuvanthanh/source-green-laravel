<?php

namespace GGPHP\LateEarly\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LateEarlyUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $lateEarlyStatus = implode(',', config('constants-lateEarly.LATE_EARLY_STATUS'));

        return [
            'status' => 'required|string|in:' . $lateEarlyStatus,
        ];
    }
}
