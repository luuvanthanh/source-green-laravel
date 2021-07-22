<?php

namespace GGPHP\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrainingMajorCreateRequest extends FormRequest
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
            'name' => 'required|string|unique:TrainingMajors,Name',
            'code' => 'required|string|unique:TrainingMajors,Code',
        ];
    }
}
