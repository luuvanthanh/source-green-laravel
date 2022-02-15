<?php

namespace GGPHP\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ParamaterValueCreateRequest extends FormRequest
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
            'name' => 'required|string|unique:ParameterValues,Name',
            'code' => 'required|string|unique:ParameterValues,Code',
            'applyDate' => 'required',
            'valueDefault' => 'required',
            'note' => 'required',
            'type' => 'required',
        ];
    }
}
