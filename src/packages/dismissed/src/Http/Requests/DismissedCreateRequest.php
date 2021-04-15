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
            'DecisionNumber' => 'unique:dismisseds,DecisionNumber',
            'DecisionDate' => 'required',
            'reason' => 'required',
            'data' => 'required|array',
            'data.*.EmployeeId' => 'required',
            'data.*.BranchId' => 'required',
            'data.*.DivisionId' => 'required',
            'data.*.PositionId' => 'required',
            'data.*.note' => 'required',
        ];
    }
}
