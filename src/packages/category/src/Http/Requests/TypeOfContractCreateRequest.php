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
            "code" => 'required|string',
            "type" => 'required|string',
            "name" => 'required',
            "year" => 'required',
            "month" => 'required',
            "paramValue" => 'required|array',
            "paramFormula" => 'required|array',
        ];
    }
}
