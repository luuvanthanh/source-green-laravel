<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateChildEvaluateInfoRequest extends FormRequest
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
            'other_issue' => 'string',
            'parent_hope' => 'string',
            'admission_register_id' => 'exists:admission_registers,id',
            'child_description' => 'array',
            'child_issue' => 'array'
        ];
    }
}
