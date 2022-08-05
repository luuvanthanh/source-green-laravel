<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\EducationalLevel;
use Illuminate\Foundation\Http\FormRequest;

class EducationalLevelCreateRequest extends FormRequest
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
                'string', 'max:255',
                function ($attribute, $value, $fail) {
                    $educationalLevel = EducationalLevel::where('Name', $value)->first();

                    if (!is_null($educationalLevel)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string', 'max:255',
                function ($attribute, $value, $fail) {
                    $educationalLevel = EducationalLevel::where('Code', $value)->first();

                    if (!is_null($educationalLevel)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
