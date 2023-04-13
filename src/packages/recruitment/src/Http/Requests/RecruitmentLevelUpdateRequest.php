<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\Level;
use GGPHP\Recruitment\Models\RecruitmentConfiguration;
use GGPHP\Recruitment\Models\RecruitmentLevel;
use GGPHP\Recruitment\Models\RecruitmentManager;
use Illuminate\Foundation\Http\FormRequest;

class RecruitmentLevelUpdateRequest extends FormRequest
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
                    $recruitmentManager = RecruitmentManager::where('RecruitmentLevelId', $value)->first();

                    if (!is_null($recruitmentConfiguration) || !is_null($recruitmentManager)) {
                        return $fail('Dữ liệu đang được sử dụng!');
                    }
                },
            ],
            'name' => [
                'nullable', 'string',
                function ($attribute, $value, $fail) {
                    $level = RecruitmentLevel::where('Name', $value)->where('Id', '!=', $this->id)->first();
                    
                    if (is_null($level)) {
                        return true;
                    }

                    return $fail('Dữ liệu đã có trong hệ thống');
                },
            ],
            'decription' => 'nullable|string',
        ];
    }
}
