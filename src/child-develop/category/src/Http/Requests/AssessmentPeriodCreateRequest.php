<?php

namespace GGPHP\ChildDevelop\Category\Http\Requests;

use GGPHP\ChildDevelop\Category\Models\AssessmentPeriod;
use Illuminate\Foundation\Http\FormRequest;

class AssessmentPeriodCreateRequest extends FormRequest
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
            'schoolYearId' => 'required',
            'startDate' => 'required|date_format:Y-m-d',
            'endDate' => 'required|date_format:Y-m-d',
            'branchId' => 'required',
            'classesId' => 'required',
            'nameAssessmentPeriodId' => [
                'required',
                function ($attributes, $value, $fail) {
                    $assessmentPeriod = AssessmentPeriod::where('SchoolYearId', $this->schoolYearId)->where('NameAssessmentPeriodId', $value)->first();

                    if (is_null($assessmentPeriod)) {
                        return true;
                    }

                    return $fail('Kỳ này đã được tạo trong năm học');
                }
            ]
        ];
    }
}
