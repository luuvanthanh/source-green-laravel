<?php

namespace GGPHP\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TypeOfContractCreateRequest extends FormRequest
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
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $typeOfContract = \GGPHP\Category\Models\TypeOfContract::where('Name', $value)->first();

                    if (!is_null($typeOfContract)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $typeOfContract = \GGPHP\Category\Models\TypeOfContract::where('Code', $value)->first();

                    if (!is_null($typeOfContract)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'month' => 'required',
            'year' => 'required',
            'paramValue' => 'required|array',
            // "paramFormula" => 'required|array',
        ];
    }
}
