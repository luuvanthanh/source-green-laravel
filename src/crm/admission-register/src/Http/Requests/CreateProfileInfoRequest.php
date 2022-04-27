<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProfileInfoRequest extends FormRequest
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
            'create_rows' => 'array',
            'update_rows' => 'array',
            'delete_rows' => 'array',
            'create_rows.*.admission_register_id' => 'required|exists:admission_registers,id',
            'create_rows.*.config_profile_info_id' => 'required|exists:config_profile_infos,id'
        ];
    }
}
