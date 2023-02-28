<?php

namespace GGPHP\DecisionSuspend\Http\Requests;

use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use Illuminate\Foundation\Http\FormRequest;

class DecisionSuspendCreateRequest extends FormRequest
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
            'decisionDate' => 'required',
            'employeeId' => 'required',
            'from' => 'required',
            'to' => 'required','numberForm' => 'required|exists:DecisionNumberSamples,NumberForm',
            'type' => 'required|in:' . DecisionNumberSample::TYPE['SUSPEND'],
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
