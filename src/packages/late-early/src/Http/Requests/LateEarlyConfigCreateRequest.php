<?php

namespace GGPHP\LateEarly\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LateEarlyConfigCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $lateEarlyConfigType = implode(',', config('constants-lateEarly.LATE_EARLY_TYPE'));

        return [
            'deleteIds' => 'array',
            'updateRows' => 'array',
            'updateRows.*.id' => 'required|exists:LateEarlyTimeConfigs,Id',
            'updateRows.*.fromTime' => 'required',
            'updateRows.*.toTime' => 'required|after:UpdateRows.*.FromTime',
            'updateRows.*.description' => 'required|max:255',
            'updateRows.*.type' => 'required|string|in:' . $lateEarlyConfigType,
            'createRows' => 'array',
            'createRows.*.fromTime' => 'required',
            'createRows.*.toTime' => 'required|after:CreateRows.*.FromTime',
            'createRows.*.description' => 'required|max:255',
            'createRows.*.type' => 'required|string|in:' . $lateEarlyConfigType,
            'type' => 'required|string|in:' . $lateEarlyConfigType,
        ];
    }
}
