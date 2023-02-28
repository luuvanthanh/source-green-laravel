<?php

namespace GGPHP\ResignationDecision\Http\Requests;

use GGPHP\ResignationDecision\Models\ResignationDecision;
use Illuminate\Foundation\Http\FormRequest;

class ResignationDecisionUpdateRequest extends FormRequest
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
            'decisionNumber' => [
                'string',
                function ($attribute, $value, $fail) {
                    $ResignationDecision = ResignationDecision::where('DecisionNumber', $value)->where('Id', '!=', request()->id)->first();

                    if (!is_null($ResignationDecision)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'numberForm' => 'nullable|exists:DecisionNumberSamples,NumberForm',
            'ordinalNumber' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    $resignationDecision = ResignationDecision::where('NumberForm', $this->numberForm)->where('Id', '!=', $this->id)->first();

                    if (is_null($resignationDecision)) {
                        return true;
                    }

                    if ($value == $resignationDecision->OrdinalNumber) {
                        return $fail('Số thứ tự phải khác số đã có.');
                    }

                    return true;
                }
            ]
        ];
    }
}
