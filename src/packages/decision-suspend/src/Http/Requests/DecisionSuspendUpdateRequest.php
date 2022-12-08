<?php

namespace GGPHP\DecisionSuspend\Http\Requests;

use GGPHP\DecisionSuspend\Models\DecisionSuspend;
use Illuminate\Foundation\Http\FormRequest;

class DecisionSuspendUpdateRequest extends FormRequest
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
                    $decisionSuspend = DecisionSuspend::where('NumberForm', $this->numberForm)->where('Id', '!=', $this->id)->first();

                    if (is_null($decisionSuspend)) {
                        return true;
                    }

                    if ($value == $decisionSuspend->OrdinalNumber) {
                        return $fail('Số thứ tự phải khác số đã có.');
                    }

                    return true;
                }
            ]
        ];
    }
}
