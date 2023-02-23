<?php

namespace GGPHP\ChildDevelop\Category\Http\Requests;

use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\Clover\Models\PeriodicAssessmentPhysical;
use GGPHP\Clover\Models\PhysicalCriteriaStudent;
use GGPHP\Clover\Models\PhysicalEvaluateTemplate;
use Illuminate\Foundation\Http\FormRequest;

class AssessmentPeriodDeleteRequest extends FormRequest
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
            'id' => function ($attributes, $value, $fail) { 
                $testSemester = TestSemester::where('AssessmentPeriodId', $value)->first();
                $periodicAssessmentPhysical  = PeriodicAssessmentPhysical::where('AssessmentPeriodId', $value)->first();
                $physicalEvaluateTemplate  = PhysicalEvaluateTemplate::where('AssessmentPeriodId', $value)->first();
                $physicalCriteriaStudent  = PhysicalCriteriaStudent::where('AssessmentPeriodId', $value)->first();

                if (!is_null($testSemester) || !is_null($periodicAssessmentPhysical) || !is_null($physicalEvaluateTemplate) || !is_null($physicalCriteriaStudent)) {
                    return $fail('Dữ liệu đã được sử dụng không được xóa');
                }
            }
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();
       
        $data['id'] = $data['id'] = $this->route('assessment_period');

        return $data;
    }
}
