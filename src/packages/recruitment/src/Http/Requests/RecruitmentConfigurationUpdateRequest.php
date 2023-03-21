<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\RecruitmentConfiguration;
use Illuminate\Foundation\Http\FormRequest;

class RecruitmentConfigurationUpdateRequest extends FormRequest
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
            'id' => 'required',
            'name' => [
                'nullable', 'string',
                function ($attribute, $value, $fail) {
                    $recruitmentConfiguration = RecruitmentConfiguration::where('Name', $value)->where('Id', '!=', $this->id)->first();

                    if (is_null($recruitmentConfiguration)) {
                        return true;
                    }

                    return $fail('Dữ liệu đã có trong hệ thống');
                },
            ],
            'divisionId' => 'nullable|exists:Divisions,Id',
            'recruitmentLevelId' => 'nullable|exists:RecruitmentLevels,Id',
            'data' => 'array|nullable',
            'data.*.name' => 'string|distinct'
        ];
    }
}
