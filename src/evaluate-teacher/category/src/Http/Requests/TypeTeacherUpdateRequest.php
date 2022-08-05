<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\TypeTeacher;
use Illuminate\Foundation\Http\FormRequest;

class TypeTeacherUpdateRequest extends FormRequest
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
                    $typeTeacher = TypeTeacher::where('Name', $value)->where('Id', '!=', request()->type_teacher)->first();

                    if (!is_null($typeTeacher)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $typeTeacher = TypeTeacher::where('Code', $value)->where('Id', '!=', request()->type_teacher)->first();

                    if (!is_null($typeTeacher)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
