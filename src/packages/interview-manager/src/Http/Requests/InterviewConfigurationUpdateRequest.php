<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewConfiguration;
use Illuminate\Foundation\Http\FormRequest;

class InterviewConfigurationUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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
            'divisionId' => 'nullable|exists:Divisions,Id',
            'name' => [
                'nullable','string',
                function ($attribute, $value, $fail) {
                    $evaluationCriteria = InterviewConfiguration::where('Name', $value)->where('Id' , '!=', $this->interview_configuration)->first();

                    if (!is_null($evaluationCriteria)) {

                        return $fail('Dữ liệu đã có trong hệ thống');
                    }
                },
            ],
            'note' => 'nullable|string',
            'evaluationCriteriaId' => 'nullable|array',
            'evaluationCriteriaId.*' => 'nullable|exists:EvaluationCriterias,Id'
        ];
    }
}
