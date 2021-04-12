<?php

namespace GGPHP\Appoint\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppointCreateRequest extends FormRequest
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
            'decision_number' => 'unique:appoints,decision_number',
            'user_create' => 'required',
            'time_apply' => [
                'required',
                'date',
                'after:today',
            ],
        ];
    }
}
