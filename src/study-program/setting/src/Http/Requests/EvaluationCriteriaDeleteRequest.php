<?php

namespace GGPHP\StudyProgram\Setting\Http\Requests;

use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetailSubjectChildren;
use GGPHP\StudyProgram\Setting\Models\EvaluationCriteria;
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
                    $quarterReportDetailSubjectChildren = QuarterReportDetailSubjectChildren::where('EvaluationCriteriaId', $value)->get();

                    if ($quarterReportDetailSubjectChildren->isNotEmpty()) {
                        return $fail('Data is being used.');
                    }
                }
            ],
        ];
    }
}
