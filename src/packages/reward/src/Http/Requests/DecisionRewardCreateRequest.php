<?php

namespace GGPHP\Reward\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DecisionRewardCreateRequest extends FormRequest
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
            'decision_number' => 'unique:decision_rewards,decision_number',
            'decision_date' => 'required',
            'reason' => 'required',
            'type' => 'required',
            'data' => 'required|array',
            'data.*.employee_id' => 'required',
            'data.*.money' => 'required',
            'data.*.note' => 'required',
        ];
    }
}
