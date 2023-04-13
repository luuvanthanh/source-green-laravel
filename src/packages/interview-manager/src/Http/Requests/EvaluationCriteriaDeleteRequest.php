<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\EvaluationCriteria;
use GGPHP\InterviewManager\Models\InterviewConfigurationEvaluationCriteria;
use GGPHP\InterviewManager\Models\InterviewDetail;
use Illuminate\Foundation\Http\FormRequest;

class EvaluationCriteriaDeleteRequest extends FormRequest
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
                    $interviewConfigura = InterviewConfigurationEvaluationCriteria::where('EvaluationCriteriaId' , $value)->first();
                    $interViewDetail = InterviewDetail::where('EvaluationCriteriaId', $value)->first();
                    
                    if (!is_null($interviewConfigura) || !is_null($interViewDetail)) {

                        return $fail('Dữ liệu đã được sử dụng');
                    }
                },
            ]
        ];
    }
}