<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmTransporterCreateRequest extends FormRequest
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
            'confirm_transporter' => 'array',
            'confirm_transporter.*.full_name' => 'required',
            'confirm_transporter.*.relationship' => 'required',
        ];
    }
}
