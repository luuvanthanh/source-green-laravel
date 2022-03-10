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
            'name' => ['string','required', function ($attribute, $value, $fail) {
                $typeTeacher = TypeTeacher::where('Name', $value)->first();

                if (!is_null($typeTeacher)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            },],
            'code' => ['string','required', function ($attribute, $value, $fail) {
                $typeTeacher = TypeTeacher::where('Code', $value)->first();

                if (!is_null($typeTeacher)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            },],
            'typeOfContractId' => 'required|exists:TypeOfContracts,Id',
            'ratingLevelFrom' => ['required', function ($attribute, $value, $fail) {
                $typeTeacher = RatingLevel::where('Id', $value)->first();
                
                if (is_null($typeTeacher)) {
                    return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                }
            },],
            'ratingLevelTo' => function ($attribute, $value, $fail) {
                $typeTeacher = RatingLevel::where('Id', $value)->first();

                if (is_null($typeTeacher)) {
                    return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                }
            },
        ];
    }
}
