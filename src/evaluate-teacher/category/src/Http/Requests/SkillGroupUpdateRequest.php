<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SkillGroupUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [];
    }
}
