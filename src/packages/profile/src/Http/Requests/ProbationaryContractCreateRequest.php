<?php

namespace GGPHP\Profile\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProbationaryContractCreateRequest extends FormRequest
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
            'contract_number' => 'required|string',
            'contract_date' => 'required|date',
            'type_of_contract_id' => 'required|exists:type_of_contracts,id',
            'salary_ratio' => 'required',
            'month' => 'required',
            'division_id' => 'required|exists:divisions,id',
            'contract_from' => 'required|date',
            'contract_to' => 'required|date',
            'position_id' => 'required|exists:positions,id',
            'work' => 'required|string',
            'work_time' => 'required|string',
            'branch_id' => 'required|exists:branchs,id',
        ];
    }
}
