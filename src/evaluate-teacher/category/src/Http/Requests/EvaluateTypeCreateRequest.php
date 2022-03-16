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
            'name' => ['string','required', function ($attribute, $value, $fail) {
                $evaluateType = EvaluateType::where('Name', $value)->first();

                if (!is_null($evaluateType)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            },],
            'code' => ['string','required', function ($attribute, $value, $fail) {
                $evaluateType = EvaluateType::where('Code', $value)->first();

                if (!is_null($evaluateType)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            },],
        ];
    }
}
