<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateParentInfoRequest extends FormRequest
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
            'createRows' => 'array',
            'updateRows' => 'array',
            'createRows.*.full_name' => 'required|string',
            'createRows.*.birth_date' => 'required|date_format:Y-m-d',
            'createRows.*.sex' => 'string',
            'createRows.*.email' => 'email',
            'createRows.*.address' => 'string',
            'createRows.*.admission_register_id' => 'exists:admission_registers,id'
        ];
    }
}
