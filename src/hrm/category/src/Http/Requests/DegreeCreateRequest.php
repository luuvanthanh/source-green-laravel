<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\Degree;
use Illuminate\Foundation\Http\FormRequest;

class DegreeCreateRequest extends FormRequest
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
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $degree = Degree::where('Name', $value)->first();

                    if (!is_null($degree)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu!');
                    }
                },
            ],
            'code' => [
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $degree = Degree::where('Code', $value)->first();

                    if (!is_null($degree)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu!');
                    }
                },
            ],
        ];
    }
}
