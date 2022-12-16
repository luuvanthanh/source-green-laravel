<?php

namespace GGPHP\StudyProgram\ScriptReview\Http\Requests;

use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use Illuminate\Foundation\Http\FormRequest;

class ScriptReviewCreateRequest extends FormRequest
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
            'schoolYearId' => 'required|check_exists:fee.SchoolYears,Id',
            'type' => [
                'required',
                function ($attribute, $value, $fail) {
                    $monthlyComment = ScriptReview::TYPE['MONTHLY_COMMENT'];
                    $quarterReport = ScriptReview::TYPE['QUARTER_REPORT'];

                    if ($monthlyComment == $value) {

                        $scriptReview = ScriptReview::where('SchoolYearId', $this->schoolYearId)
                            ->where('Type', $value)
                            ->whereHas('branch', function ($query) {
                                $query->whereIn('BranchId', $this->branchId);
                            })
                            ->whereHas('classes', function ($query) {
                                $query->whereIn('ClassId', $this->classId);
                            })
                            ->get();

                        if (!empty($scriptReview)) {
                            return $fail('Cấu hình đã tồn tại');
                        }
                    } elseif ($quarterReport == $value) {
                        $scriptReview = ScriptReview::where('SchoolYearId', $this->schoolYearId)
                            ->where('NameAssessmentPeriodId', $this->nameAssessmentPeriodId)
                            ->where('Type', $value)
                            ->whereHas('branch', function ($query) {
                                $query->whereIn('BranchId', $this->branchId);
                            })
                            ->whereHas('classes', function ($query) {
                                $query->whereIn('ClassId', $this->classId);
                            })
                            ->get();

                        if (!empty($scriptReview)) {
                            return $fail('Cấu hình đã tồn tại');
                        }
                    }
                },
            ],
            'branchId' => 'required|array|exists:Branches,Id',
            'classId' => 'required|array|check_exists:origination.Classes,Id',
            'nameAssessmentPeriodId' => 'nullable|exists:NameAssessmentPeriods,Id',
            'subject' => 'array',
            'subject.*.subjectId' => 'nullable|check_exists:study-program.Subjects,Id',
            'subject.*.isCheck' => 'nullable|boolean',
            'subject.*.subjectSection' => 'nullable|array',
            'subject.*.subjectSection.*.subjectSectionId' => 'nullable|check_exists:study-program.SubjectSections,Id',
            'subject.*.subjectSection.*.detail.*.subjectSectionDetailId' => 'nullable|check_exists:study-program.SubjectSectionDetails,Id',
            'comment.*.sampleCommentId' => 'nullable|check_exists:study-program.SampleComments,Id',
            'comment.*.commentDetail.*.sampleCommentDetailId' => 'nullable|check_exists:study-program.SampleCommentDetails,Id',
        ];
    }

    public function all($key = null)
    {
        $data = parent::all();
        $data['type'] = ScriptReview::TYPE[$data['type']];

        return $data;
    }
}
