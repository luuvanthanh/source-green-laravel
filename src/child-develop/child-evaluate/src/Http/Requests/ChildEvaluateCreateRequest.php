<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Http\Requests;

use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
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
            'age' => [
                function ($attribute, $value, $fail) {
                    $categoryChildIssue = ChildEvaluate::where('Age', $value)->where('CategorySkillId', request()->categorySkillId)->first();

                    if (is_null($categoryChildIssue)) {
                        return true;
                    }

                    return $fail('Kỹ năng và độ tuổi trùng nhau thì chỉ tạo được một lần');
                },
            ],
        ];
    }
}
