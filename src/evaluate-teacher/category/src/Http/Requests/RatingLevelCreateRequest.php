<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\RatingLevel;
use Illuminate\Foundation\Http\FormRequest;

class RatingLevelCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'string|check_unique:evaluate-teacher.RatingLevels,Name',
            'code' => 'string|check_unique:evaluate-teacher.RatingLevels,Code',
        ];
    }
}
