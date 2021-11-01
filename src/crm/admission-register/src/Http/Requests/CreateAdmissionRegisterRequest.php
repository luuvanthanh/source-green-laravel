<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAdmissionRegisterRequest extends FormRequest
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
            'customer_lead_id' => 'exists:customer_leads,id',
            'student_info_id' => 'required|exists:student_infos,id',
            'date_register' => 'required|date_format:Y-m-d',
            'parent_wish' => 'string',
            'children_note' => 'string'
        ];
    }
}
