<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\RatingLevel;
use GGPHP\EvaluateTeacher\Category\Models\EvaluateStep;
use Illuminate\Foundation\Http\FormRequest;

class EvaluateStepCreateRequest extends FormRequest
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
            'name' => 'string|check_unique:evaluate-teacher.EvaluateSteps,Name',
            'code' => 'string|check_unique:evaluate-teacher.EvaluateSteps,Code',
            'evaluateTypeId' => 'required|array|check_exists:evaluate-teacher.EvaluateTypes,Id'
        ];
    }
}
