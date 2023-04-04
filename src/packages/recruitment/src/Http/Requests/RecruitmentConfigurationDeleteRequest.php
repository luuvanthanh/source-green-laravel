<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\RecruitmentManager;
use GGPHP\Recruitment\Models\RecruitmentQuestion;
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
                function ($attribute, $value, $fail) {
                    $recruitmentConfiguration = RecruitmentManager::where('RecruitmentConfigurationId', $value)->first();
                    $recruitmentQuestion = RecruitmentQuestion::where('RecruitmentConfigurationId', $value)->first();
                    
                    if (is_null($recruitmentConfiguration) && is_null($recruitmentQuestion)) {
                        return true;
                    }

                    return $fail('Dữ liệu đã được sử dụng');
                },
            ],
        ];
    }
}
