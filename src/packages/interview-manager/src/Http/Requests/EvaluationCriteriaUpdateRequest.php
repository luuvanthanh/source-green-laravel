<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\EvaluationCriteria;
use GGPHP\InterviewManager\Models\InterviewConfigurationEvaluationCriteria;
use Illuminate\Foundation\Http\FormRequest;

class EvaluationCriteriaUpdateRequest extends FormRequest
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
                    $interviewConfigura = InterviewConfigurationEvaluationCriteria::where('EvaluationCriteriaId' , $value)->get();
                    if (!is_null($interviewConfigura)) {

                        return $fail('Dữ liệu đã được sử dụng');
                    }
                },
            ],
            'name' => [
                'nullable','string',
                function ($attribute, $value, $fail) {
                    $evaluationCriteria = EvaluationCriteria::where('Name', $value)->where('Id' , '!=', $this->evaluation_criteria)->first();

                    if (!is_null($evaluationCriteria)) {

                        return $fail('Dữ liệu đã có trong hệ thống');
                    }
                },
            ],
            'note' => 'nullable|string'
        ];
    }
}