<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\EvaluateStep;
use GGPHP\EvaluateTeacher\Category\Models\EvaluateType;
use GGPHP\EvaluateTeacher\Category\Models\RatingLevel;
use GGPHP\Users\Models\User;
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
            'evaluateStepId' => ['required', function ($attribute, $value, $fail) {
                $evaluateStep = EvaluateStep::where('Id', $value)->first();

                if (is_null($evaluateStep)) {
                    return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                }
            }],
            'evaluateTypeId' => ['required', function ($attribute, $value, $fail) {
                $evaluateType = EvaluateType::where('Id', $value)->first();

                if (is_null($evaluateType)) {
                    return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                }
            }],
            'teacherEvaluate' => ['required', function ($attribute, $value, $fail) {
                $teacherEvaluate = User::where('Id', $value)->first();

                if (is_null($teacherEvaluate)) {
                    return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                }
            }],
            'teacherAreEvaluate' => ['required', function ($attribute, $value, $fail) {
                $teacherEvaluate = User::where('Id', $value)->first();

                if (is_null($teacherEvaluate)) {
                    return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                }
            }],
            'ratingLevelId' => ['required', function ($attribute, $value, $fail) {
                $ratingLevel = RatingLevel::where('Id', $value)->first();

                if (is_null($ratingLevel)) {
                    return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                }
            }],
            'detail' => 'required|array'
        ];
    }
}
