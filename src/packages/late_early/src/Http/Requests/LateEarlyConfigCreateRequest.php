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
            'delete_ids' => 'array',
            'update_rows' => 'array',
            'update_rows.*.id' => 'required|exists:late_early_time_configs,id',
            'update_rows.*.from_time' => 'required',
            'update_rows.*.to_time' => 'required|after:update_rows.*.from_time',
            'update_rows.*.description' => 'required|max:255',
            'update_rows.*.type' => 'required|string|in:' . $lateEarlyConfigType,
            'create_rows' => 'array',
            'create_rows.*.from_time' => 'required',
            'create_rows.*.to_time' => 'required|after:create_rows.*.from_time',
            'create_rows.*.description' => 'required|max:255',
            'create_rows.*.type' => 'required|string|in:' . $lateEarlyConfigType,
            'type' => 'required|string|in:' . $lateEarlyConfigType,
        ];
    }
}
