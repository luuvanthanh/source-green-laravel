<?php

namespace GGPHP\Transfer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransferCreateRequest extends FormRequest
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
            'decisionNumber' => 'unique:Transfers,DecisionNumber',
            'decisionDate' => 'required',
            'data' => 'required|array',
            'data.*.employeeId' => 'required',
            'data.*.branchId' => 'required',
            'data.*.divisionId' => 'required',
            'data.*.positionId' => 'required',
        ];
    }
}
