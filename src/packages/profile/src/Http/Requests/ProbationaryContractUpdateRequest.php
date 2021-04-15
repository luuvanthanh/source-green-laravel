<?php

namespace GGPHP\Profile\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProbationaryContractUpdateRequest extends FormRequest
{
    /**
     * Determine if the employee is authorized to make this request.
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
            'EmployeeId' => 'exists:employees,id',
            'contract_number' => 'string',
            'sign_date' => 'date',
            'expiration_date' => 'date',
        ];
    }
}
