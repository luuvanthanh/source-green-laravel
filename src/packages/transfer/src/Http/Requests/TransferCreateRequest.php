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
            'DecisionNumber' => 'unique:transfers,DecisionNumber',
            'DecisionDate' => 'required',
            'reason' => 'required',
            'type' => 'required',
            'data' => 'required|array',
            'data.*.EmployeeId' => 'required',
            'data.*.BranchId' => 'required',
            'data.*.DivisionId' => 'required',
            'data.*.PositionId' => 'required',
            'data.*.note' => 'required',
        ];
    }
}
