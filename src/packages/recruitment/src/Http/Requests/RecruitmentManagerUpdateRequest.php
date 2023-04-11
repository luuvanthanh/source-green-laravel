<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\Level;
use GGPHP\Recruitment\Models\RecruitmentCandidateManagement;
use GGPHP\Recruitment\Models\RecruitmentManager;
use Illuminate\Foundation\Http\FormRequest;

class RecruitmentManagerUpdateRequest extends FormRequest
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
                    $configureThank = RecruitmentCandidateManagement::where('RecruitmentManagerId', $value)->first();

                    if (is_null($configureThank)) {
                        return true;
                    }
                    
                    return $fail('Dữ liệu đã được sử dụng');
                },
            ],
            'name' => 'nullable|string',
            'startDate' => 'nullable|date|date_format:Y-m-d',   
            'endDate' => 'nullable|date|date_format:Y-m-d|after_or_equal:startDate',
            'numberOfRecruitments' => 'nullable|integer',
            'divisionId' => 'nullable|exists:Divisions,Id',
            'recruitmentLevelId' => 'nullable|exists:RecruitmentLevels,Id',
            'recruitmentConfigurationId' => 'nullable|exists:RecruitmentConfigurations,Id',
            'link' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    $configureThank = RecruitmentManager::where('Link', $value)->where('Id', '!=', $this->id)->first();

                    if (!is_null($configureThank)) {
                        return true;
                    }
                    
                    return $fail('Dữ liệu đã có trong hệ thống');
                },
            ]
        ];
    }
}
