<?php

namespace GGPHP\Reward\Http\Requests;

use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
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
            'numberForm' => 'required|exists:DecisionNumberSamples,NumberForm',
            'typeDecisionNumberSample' => 'required|in:' . DecisionNumberSample::TYPE['DISCIPLINE_REWARD'],
            'decisionNumberSampleId' => 'required|uuid|exists:DecisionNumberSamples,Id',
            'ordinalNumber' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $decisionNumberSample = DecisionNumberSample::findOrFail($this->decisionNumberSampleId);

                    if ($value == $decisionNumberSample->OrdinalNumber) {
                        return $fail('Số thứ tự phải khác số đã có.');
                    }

                    return true;
                }
            ]
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        if (!empty($data['typeDecisionNumberSample'])) {
            $data['typeDecisionNumberSample'] = array_key_exists($data['typeDecisionNumberSample'], DecisionNumberSample::TYPE) ? DecisionNumberSample::TYPE[$data['typeDecisionNumberSample']] : 0;
        }

        return $data;
    }
}
