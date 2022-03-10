<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\RatingLevel;
use Illuminate\Foundation\Http\FormRequest;

class RatingLevelUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => [
                'string',
                function ($attribute, $value, $fail) {
                    $ratingLevel = RatingLevel::where('Name', $value)->where('Id', '!=', request()->rating_level)->first();

                    if (!is_null($ratingLevel)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $ratingLevel = RatingLevel::where('Code', $value)->where('Id', '!=', request()->rating_level)->first();

                    if (!is_null($ratingLevel)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
