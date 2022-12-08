<?php

namespace GGPHP\ResignationDecision\Http\Requests;

use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use Illuminate\Foundation\Http\FormRequest;

class ResignationDecisionCreateRequest extends FormRequest
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
            'decisionNumber' => 'unique:ResignationDecisions,DecisionNumber',
            'decisionDate' => 'required',
            'employeeId' => 'required',
            'timeApply' => 'required',
            'payEndDate' => [
                'required',
                // function ($attribute, $value, $fail) {
                //     $timeApply = request()->timeApply;

                //     if ($value >= $timeApply) {
                //         return $fail('Trường phải là một ngày trước ngày áp dụng');
                //     }
                // },
            ],
            'numberForm' => 'required|exists:DecisionNumberSamples,NumberForm',
            'type' => 'required|in:' . DecisionNumberSample::TYPE['RESIGNATION'],
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

        if (!empty($data['type'])) {
            $data['type'] = array_key_exists($data['type'], DecisionNumberSample::TYPE) ? DecisionNumberSample::TYPE[$data['type']] : 0;
        }

        return $data;
    }
}
