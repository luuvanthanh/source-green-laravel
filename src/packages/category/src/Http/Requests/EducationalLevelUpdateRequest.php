<?php

namespace GGPHP\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EducationalLevelUpdateRequest extends FormRequest
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
            'name' => [
                'string',
                function ($attribute, $value, $fail) {
                    $educationalLevel = \GGPHP\Category\Models\EducationalLevel::where('Name', $value)->where('Id', '!=', request()->educational_level)->first();

                    if (!is_null($educationalLevel)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $educationalLevel = \GGPHP\Category\Models\EducationalLevel::where('Code', $value)->where('Id', '!=', request()->educational_level)->first();

                    if (!is_null($educationalLevel)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
