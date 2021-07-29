<?php

namespace GGPHP\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TypeOfContractUpdateRequest extends FormRequest
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
                    $typeOfContract = \GGPHP\Category\Models\TypeOfContract::where('Name', $value)->where('Id', '!=', request()->type_of_contract)->first();

                    if (!is_null($typeOfContract)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $typeOfContract = \GGPHP\Category\Models\TypeOfContract::where('Code', $value)->where('Id', '!=', request()->type_of_contract)->first();

                    if (!is_null($typeOfContract)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
