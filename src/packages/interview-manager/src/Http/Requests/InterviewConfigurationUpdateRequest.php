<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewConfiguration;
use GGPHP\InterviewManager\Models\InterviewConfigurationEvaluationCriteria;
use GGPHP\InterviewManager\Models\InterviewList;
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    // $interviewConfigura = InterviewConfigurationEvaluationCriteria::where('InterviewConfigurationId' , $this->interview_configuration)->first();
                    // $interviewList = InterviewList::where('InterviewConfigurationId' , $this->interview_configuration)->first();

                    // if (!is_null($interviewConfigura) || !is_null($interviewList)) {

                    //     return $fail('Dữ liệu đã được sử dụng');
                    // }
                },
            ],
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
            'evaluationCriteriaId.*' => 'nullable|exists:EvaluationCriteriass,Id'
        ];
    }
}
