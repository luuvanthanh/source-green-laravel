<?php

namespace GGPHP\StudyProgram\ScriptReview\Http\Requests;

use GGPHP\StudyProgram\QuarterReport\Models\QuarterReport;
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
                        $scriptReview = ScriptReview::where('Type', ScriptReview::TYPE['MONTHLY_COMMENT'])
                            ->where('SchoolYearId', $this->schoolYearId)
                            ->where('NameAssessmentPeriodId', $this->nameAssessmentPeriodId)
                            ->whereHas('branch', function ($query) {
                                $query->whereIn('BranchId', $this->branchId);
                            })
                            ->whereHas('classes', function ($query) {
                                $query->whereIn('ClassId', $this->classId);
                            })->get();

                        if ($scriptReview->isNotEmpty()) {
                            return $fail('Configuration already exists');
                        }
                    } elseif ($quarterReport == $value) {
                        $scriptReview = ScriptReview::where('Type', ScriptReview::TYPE['QUARTER_REPORT'])
                            ->where('SchoolYearId', $this->schoolYearId)
                            ->where('NameAssessmentPeriodId', $this->nameAssessmentPeriodId)
                            ->whereHas('branch', function ($query) {
                                $query->whereIn('BranchId', $this->branchId);
                            })
                            ->whereHas('classes', function ($query) {
                                $query->whereIn('ClassId', $this->classId);
                            })->get();

                        if ($scriptReview->isNotEmpty()) {
                            return $fail('Configuration already exists');
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

    public function messages()
    {
        return [
            'check_exists' => 'The selected :attribute is invalid.',
            'boolean' => 'The :attribute field must be true or false.',
            'array' => 'The :attribute must be an array.',
            'exists' => 'The selected :attribute is invalid.',
        ];
    }
}
