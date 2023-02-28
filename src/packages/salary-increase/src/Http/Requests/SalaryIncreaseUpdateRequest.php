<?php

namespace GGPHP\SalaryIncrease\Http\Requests;

use GGPHP\SalaryIncrease\Models\SalaryIncrease;
use Illuminate\Foundation\Http\FormRequest;

class SalaryIncreaseUpdateRequest extends FormRequest
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
                    $salaryIncrease = SalaryIncrease::where('NumberForm', $this->numberForm)->where('Id', '!=', $this->id)->first();

                    if (is_null($salaryIncrease)) {
                        return true;
                    }

                    if ($value == $salaryIncrease->OrdinalNumber) {
                        return $fail('Số thứ tự phải khác số đã có.');
                    }

                    return true;
                }
            ]
        ];
    }
}
