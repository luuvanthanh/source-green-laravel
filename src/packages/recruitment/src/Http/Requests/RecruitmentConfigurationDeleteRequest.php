<?php

namespace GGPHP\Recruitment\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecruitmentConfigurationDeleteRequest extends FormRequest
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
                // function ($attribute, $value, $fail) {
                //     $example = Example::where('RecruitmentLevelId', $value)->first();

                //     if (!is_null($example)) {
                //         return $fail('Dữ liệu đang được sử dụng!');
                //     }
                // },
            ],
        ];
    }
}
