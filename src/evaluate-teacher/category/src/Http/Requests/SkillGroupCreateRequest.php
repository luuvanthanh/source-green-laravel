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
            'name' => ['string','required', function ($attribute, $value, $fail) {
                $skillGroup = SkillGroup::where('Name', $value)->first();

                if (!is_null($skillGroup)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            },],
            'code' => ['string','required', function ($attribute, $value, $fail) {
                $skillGroup = SkillGroup::where('Code', $value)->first();

                if (!is_null($skillGroup)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            },],
        ];
    }
}
