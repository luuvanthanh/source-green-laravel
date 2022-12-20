<?php

namespace GGPHP\StudyProgram\QuarterReport\Http\Requests;

use GGPHP\StudyProgram\QuarterReport\Models\QuarterReport;
use Illuminate\Foundation\Http\FormRequest;

class QuarterReportUpdateRequest extends FormRequest
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
        $status = implode(',', QuarterReport::STATUS);
        $type = implode(',', QuarterReport::TYPE);

        return [
            'studentId' => 'check_exists:object.Students,Id',
            'schoolYearId' => 'check_exists:fee.SchoolYears,Id',
            'scriptReviewId' => 'check_exists:study-program.ScriptReviews,Id',
            'status' => 'in:' . $status,
            'type' => 'nullable|in:' . $type,
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();

        if (!empty($data['status'])) {
            $data['status'] = QuarterReport::STATUS[$data['status']];
        }

        if (!empty($data['type'])) {
            $data['type'] = QuarterReport::TYPE[$data['type']];
        }

        return $data;
    }
}
