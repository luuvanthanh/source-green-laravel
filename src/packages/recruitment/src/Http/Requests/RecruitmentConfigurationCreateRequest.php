<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\Level;
use Illuminate\Foundation\Http\FormRequest;

class RecruitmentConfigurationCreateRequest extends FormRequest
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
            'name' => 'required|string|unique:RecruitmentConfigurations,Name',
            'divisionId' => 'required|exists:Divisions,Id',
            'recruitmentLevelId' => 'required|exists:RecruitmentLevels,Id',
            'data' => 'array|nullable',
            'data.*.name' => 'string|distinct'
        ];
    }
}
