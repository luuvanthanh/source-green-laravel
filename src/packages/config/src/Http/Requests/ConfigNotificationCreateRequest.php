<?php

namespace GGPHP\Config\Http\Requests;

use GGPHP\Config\Models\ConfigNotification;
use Illuminate\Foundation\Http\FormRequest;

class ConfigNotificationCreateRequest extends FormRequest
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
            'workHour' => 'required',
            'workHour.type' => 'required|in:WORK_HOUR',
            'workHour.date' => 'required',
            'workHour.hour' => 'required|int|max:23',
            'businessCard' => 'required',
            'businessCard.type' => 'required|in:BUSINESS_CARD',
            'businessCard.date' => 'required',
            'businessCard.hour' => 'required|int|max:23',
            'birthday' => 'required',
            'birthday.type' => 'required|in:BIRTHDAY',
            'birthday.date' => 'required',
        ];
    }
}
