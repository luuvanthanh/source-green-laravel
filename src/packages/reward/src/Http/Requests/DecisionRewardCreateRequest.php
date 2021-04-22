<?php

namespace GGPHP\Reward\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DecisionRewardCreateRequest extends FormRequest
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
            'decisionNumber' => 'unique:DecisionRewards,DecisionNumber',
            'decisionDate' => 'required',
            'reason' => 'required',
            'type' => 'required',
            'data' => 'required|array',
            'data.*.employeeId' => 'required',
            'data.*.money' => 'required',
            'data.*.note' => 'required',
        ];
    }
}
