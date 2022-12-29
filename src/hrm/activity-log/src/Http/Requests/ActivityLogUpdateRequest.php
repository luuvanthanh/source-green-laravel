<?php

namespace GGPHP\ActivityLog\Http\Requests;

use GGPHP\ActivityLog\Models\ActivityLog;
use Illuminate\Foundation\Http\FormRequest;

class ActivityLogUpdateRequest extends FormRequest
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
            'name' => [
                'string',
                function ($attribute, $value, $fail) {
                    $activityLog = ActivityLog::where('Name', $value)->where('Id', '!=', request()->activityLog)->first();

                    if (!is_null($activityLog)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $activityLog = ActivityLog::where('Code', $value)->where('Id', '!=', request()->activityLog)->first();

                    if (!is_null($activityLog)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
