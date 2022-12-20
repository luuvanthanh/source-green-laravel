<?php

namespace GGPHP\StudyProgram\QuarterReport\Http\Requests;

use GGPHP\StudyProgram\QuarterReport\Models\QuarterReport;
use Illuminate\Foundation\Http\FormRequest;

class QuarterReportCreateRequest extends FormRequest
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
            'studentId' => 'required|check_exists:object.Students,Id',
            'schoolYearId' => 'required|check_exists:fee.SchoolYears,Id',
            'scriptReviewId' => 'required|check_exists:study-program.ScriptReviews,Id',
            'status' => 'required|in:' . $status,
            'type' => 'nullable|in:' . $type,
            'detail' => 'array',
            'detail.*.scriptReviewSubjectId' => 'nullable|check_exists:study-program.ScriptReviewSubjects,Id',
            'detail.*.scriptReviewCommentId' => 'nullable|check_exists:study-program.ScriptReviewComments,Id',
            'detail.*.detailSubject' => 'array',
            'detail.*.detailSubject.*.scriptReviewSubjectDetailId' => 'nullable|check_exists:study-program.ScriptReviewSubjectDetails,Id',
            'detail.*.detailSubject.*.detailSubjectChildren' => 'array',
            'detail.*.detailSubject.*.detailSubjectChildren.*.scriptReviewSubjectDetailChildrenId' => 'nullable|check_exists:study-program.ScriptReviewSubjectDetailChildrens,Id',
            'detail.*.detailSubject.*.detailSubjectChildren.*.evaluationCriteriaId' => 'nullable|check_exists:study-program.EvaluationCriterias,Id',
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
