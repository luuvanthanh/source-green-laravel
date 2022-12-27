<?php

namespace GGPHP\ConfigReceiveNotification\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConfigReceiveNotificationTurnOnOffRequest extends FormRequest
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
    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id',
            'data' => 'required|array',
            'data.*.event_type_id' => 'required|exists:event_types,id',
            'data.*.is_use' => 'required|boolean'
        ];
    }
}
