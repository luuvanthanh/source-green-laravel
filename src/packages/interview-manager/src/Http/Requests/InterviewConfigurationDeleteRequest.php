<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewConfigurationEvaluationCriteria;
use Illuminate\Foundation\Http\FormRequest;

class InterviewConfigurationDeleteRequest extends FormRequest
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
            // 'id' => [
            //     'required',
            //     function ($attribute, $value, $fail) {
            //         $evaluationCriteria = InterviewConfigurationEvaluationCriteria::where('InterviewConfigurationId' , '=', $this->id)->first();

            //         if (!is_null($evaluationCriteria)) {

            //             return $fail('Dữ liệu đã được sử dụng');
            //         }
            //     },
            // ]
        ];
    }
}
