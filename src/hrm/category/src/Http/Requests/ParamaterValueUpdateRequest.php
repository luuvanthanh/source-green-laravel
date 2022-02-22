<?php

namespace GGPHP\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ParamaterValueUpdateRequest extends FormRequest
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
                    $paramaterValue = \GGPHP\Category\Models\ParamaterValue::where('Name', $value)->where('Id', '!=', request()->paramater_value)->first();

                    if (!is_null($paramaterValue)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $paramaterValue = \GGPHP\Category\Models\ParamaterValue::where('Code', $value)->where('Id', '!=', request()->paramater_value)->first();

                    if (!is_null($paramaterValue)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
