<?php

namespace GGPHP\Crm\CallCenter\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateEmployeeExtensionRequest extends FormRequest
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
            'employee_id' => 'required|exists:employees,id',
            'extension_id' => 'required|exists:extensions,id'
        ];
    }
}
