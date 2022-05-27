<?php

namespace GGPHP\TrainingTeacher\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrainingSkillCreateRequest extends FormRequest
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
            'code' => 'required|check_unique:evaluate-teacher.TrainingSkills,Code',
            'name' => 'required|string',
            'detail.*.createRows' => 'array',
            'detail.*.updateRows' => 'array',
            'detail.*.deleteRows' => 'array,',
        ];
    }
}
