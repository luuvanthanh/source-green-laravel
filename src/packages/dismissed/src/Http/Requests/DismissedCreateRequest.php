<?php

namespace GGPHP\Dismissed\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DismissedCreateRequest extends FormRequest
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
            'decisionNumber' => 'unique:Dismisseds,DecisionNumber',
            'decisionDate' => 'required',
            'reason' => 'required',
            'data' => 'required|array',
            'data.*.employeeId' => 'required',
            'data.*.branchId' => 'required',
            'data.*.divisionId' => 'required',
            'data.*.positionId' => 'required',
            'data.*.note' => 'required',
        ];
    }
}
