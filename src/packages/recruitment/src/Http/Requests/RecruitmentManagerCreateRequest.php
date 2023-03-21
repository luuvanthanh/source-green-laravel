<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\Level;
use Illuminate\Foundation\Http\FormRequest;

class RecruitmentManagerCreateRequest extends FormRequest
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
            'name' => 'required|string',
            'startDate' => 'required|date|date_format:Y-m-d',
            'endDate' => 'required|date|date_format:Y-m-d|after_or_equal:startDate',
            'numberOfRecruitments' => 'required|integer',
            'divisionId' => 'required|exists:Divisions,Id',
            'recruitmentLevelId' => 'required|exists:RecruitmentLevels,Id',
            'recruitmentConfigurationId' => 'required|exists:RecruitmentConfigurations,Id',
            'link' => 'nullable|string'
        ];
    }
}
