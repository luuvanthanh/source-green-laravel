<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTestInputRequest extends FormRequest
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
            'date_interview' => 'date_format:Y-m-d',
        ];
    }
}
