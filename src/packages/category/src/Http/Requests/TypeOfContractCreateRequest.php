<?php

namespace GGPHP\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TypeOfContractCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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
            "param_value" => 'required|array',
            "param_formula" => 'required|array',
        ];
    }
}
