<?php

namespace GGPHP\Crm\Facebook\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddLeadRequest extends FormRequest
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
            'user_facebook_info_id' => 'required|exists:user_facebook_infos,id'
        ];
    }
}
