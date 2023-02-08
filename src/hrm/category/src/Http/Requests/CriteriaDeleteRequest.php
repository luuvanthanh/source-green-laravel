<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\GradeDetail;
use Illuminate\Foundation\Http\FormRequest;

class CriteriaDeleteRequest extends FormRequest
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
                    $gradeDetail = GradeDetail::where('CriteriaId', $value)->first();

                    if (!is_null($gradeDetail)) {
                        return $fail('Dữ liệu đang được sử dụng!');
                    }
                },
            ],
        ];
    }
}
