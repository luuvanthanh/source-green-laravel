<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\SkillGroup;
use Illuminate\Foundation\Http\FormRequest;

class SkillGroupCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'string|check_unique:evaluate_teacher.SkillGroups,Name',
        ];
    }
}
