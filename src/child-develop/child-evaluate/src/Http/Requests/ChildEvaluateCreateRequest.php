<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChildEvaluateCreateRequest extends FormRequest
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
            'categorySkillId' => 'required|exists:CategorySkills,Id',
            'age' => 'required'
        ];
    }
}
