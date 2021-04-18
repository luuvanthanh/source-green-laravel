<?php

namespace GGPHP\Profile\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LabourContractCreateRequest extends FormRequest
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
            'employeeId' => 'required|exists:Employees,Id',
            'contractNumber' => 'required|string',
            'contractDate' => 'required|date',
            'typeOfContractId' => 'required|exists:type_of_contracts,Id',
            'year' => 'required',
            'month' => 'required',
            'divisionId' => 'required|exists:divisions,Id',
            'contractFrom' => 'required|date',
            'contractTo' => 'required|date',
            'positionId' => 'required|exists:positions,Id',
            'work' => 'required|string',
            'workTime' => 'required|string',
            'branchId' => 'required|exists:branches,Id',
        ];
    }
}
