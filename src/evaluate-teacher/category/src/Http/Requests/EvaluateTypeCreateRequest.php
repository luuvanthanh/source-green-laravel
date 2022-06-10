<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\EvaluateType;
use GGPHP\EvaluateTeacher\Category\Models\SkillGroup;
use Illuminate\Foundation\Http\FormRequest;

class EvaluateTypeCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'string|check_unique:evaluate-teacher.EvaluateTypes,Name',
            'code' => 'string|check_unique:evaluate-teacher.EvaluateTypes,Code',
        ];
    }
}
