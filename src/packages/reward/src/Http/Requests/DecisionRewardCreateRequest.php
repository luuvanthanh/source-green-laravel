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
            'DecisionNumber' => 'unique:decision_rewards,DecisionNumber',
            'DecisionDate' => 'required',
            'reason' => 'required',
            'type' => 'required',
            'data' => 'required|array',
            'data.*.EmployeeId' => 'required',
            'data.*.money' => 'required',
            'data.*.note' => 'required',
        ];
    }
}
