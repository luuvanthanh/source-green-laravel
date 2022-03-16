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
            'name' => ['string','required', function ($attribute, $value, $fail) {
                $ratingLevel = RatingLevel::where('Name', $value)->first();

                if (!is_null($ratingLevel)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            },],
            'code' => ['string','required', function ($attribute, $value, $fail) {
                $ratingLevel = RatingLevel::where('Code', $value)->first();

                if (!is_null($ratingLevel)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            },],
        ];
    }
}
