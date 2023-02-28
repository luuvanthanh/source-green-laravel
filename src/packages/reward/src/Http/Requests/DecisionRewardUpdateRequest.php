<?php

namespace GGPHP\Reward\Http\Requests;

use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use GGPHP\Reward\Models\DecisionReward;
use Illuminate\Foundation\Http\FormRequest;

class DecisionRewardUpdateRequest extends FormRequest
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
            'id' => 'required',
            'numberForm' => 'nullable|exists:DecisionNumberSamples,NumberForm',
            'ordinalNumber' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    $decisionReward = DecisionReward::where('NumberForm', $this->numberForm)->where('Id', '!=', $this->id)->first();

                    if (is_null($decisionReward)) {
                        return true;
                    }

                    if ($value == $decisionReward->OrdinalNumber) {
                        return $fail('Số thứ tự phải khác số đã có.');
                    }

                    return true;
                }
            ]
        ];
    }
}
