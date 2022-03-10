<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\Users\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class TypeTeacherDeleteRequest extends FormRequest
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $employees = User::where('TypeTeacherId', $value)->first();

                    if (!is_null($employees)) {
                        return $fail('Dữ liệu đang được sử dụng!');
                    }
                },
            ],
        ];
    }
}
