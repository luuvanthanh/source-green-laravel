<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\ParamaterFormula;
use Illuminate\Foundation\Http\FormRequest;

class ParamaterFormulaUpdateRequest extends FormRequest
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
            'name' => [
                'string',
                function ($attribute, $value, $fail) {
                    $paramaterFormula = ParamaterFormula::where('Name', $value)->where('Id', '!=', request()->paramater_formula)->first();

                    if (!is_null($paramaterFormula)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $paramaterFormula = ParamaterFormula::where('Code', $value)->where('Id', '!=', request()->paramater_formula)->first();

                    if (!is_null($paramaterFormula)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
