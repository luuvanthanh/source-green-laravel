<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Http\Requests;

use GGPHP\EvaluateTeacher\EvaluateTeacher\Models\RatingLevel;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Models\EvaluateTeacher;
use Illuminate\Foundation\Http\FormRequest;

class EvaluateTeacherCreateRequest extends FormRequest
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
            
        ];
    }
}
