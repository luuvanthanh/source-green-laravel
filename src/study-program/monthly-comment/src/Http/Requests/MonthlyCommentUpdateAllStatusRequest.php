<?php

namespace GGPHP\StudyProgram\MonthlyComment\Http\Requests;

use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyComment;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReport;
use Illuminate\Foundation\Http\FormRequest;

class MonthlyCommentUpdateAllStatusRequest extends FormRequest
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
        $status = implode(',', MonthlyComment::STATUS);

        return [
            'schoolYearId' => 'required|check_exists:fee.SchoolYears,Id',
            'scriptReviewId' => 'required|check_exists:study-program.ScriptReviews,Id',
            'newStatus' => 'required|in:' . $status,
            "oldStatus" => 'required|in:' . $status,
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();

        if (!empty($data['oldStatus'])) {
            $data['oldStatus'] = MonthlyComment::STATUS[$data['oldStatus']];
        }

        if (!empty($data['newStatus'])) {
            $data['newStatus'] = MonthlyComment::STATUS[$data['newStatus']];
        }

        return $data;
    }
}
