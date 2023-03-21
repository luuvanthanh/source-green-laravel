<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\RecruitmentConfiguration;
use Illuminate\Foundation\Http\FormRequest;

class RecruitmentLevelDeleteRequest extends FormRequest
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
                    $recruitmentConfiguration = RecruitmentConfiguration::where('RecruitmentLevelId', $value)->first();

                    if (!is_null($recruitmentConfiguration)) {
                        return $fail('Dữ liệu đang được sử dụng!');
                    }
                },
            ],
        ];
    }
}
