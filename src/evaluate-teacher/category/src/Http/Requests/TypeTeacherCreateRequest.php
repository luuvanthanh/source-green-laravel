<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\RatingLevel;
use GGPHP\EvaluateTeacher\Category\Models\TypeTeacher;
use Illuminate\Foundation\Http\FormRequest;

class TypeTeacherCreateRequest extends FormRequest
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
            'name' => 'string|check_unique:evaluate-teacher.TypeTeachers,Name',
            'code' => 'string|check_unique:evaluate-teacher.TypeTeachers,Code',
            'typeOfContractId' => 'required|exists:TypeOfContracts,Id',
            'ratingLevelFrom' => 'check_exists:evaluate-teacher.RatingLevels,Id',
            'ratingLevelTo' => 'check_exists:evaluate-teacher.RatingLevels,Id'
        ];
    }
}
