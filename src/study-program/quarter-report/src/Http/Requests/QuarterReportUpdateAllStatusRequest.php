<?php

namespace GGPHP\StudyProgram\QuarterReport\Http\Requests;

use GGPHP\StudyProgram\QuarterReport\Models\QuarterReport;
use Illuminate\Foundation\Http\FormRequest;

class QuarterReportUpdateAllStatusRequest extends FormRequest
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
        return [
            'schoolYearId' => 'required|check_exists:fee.SchoolYears,Id',
            'scriptReviewId' => 'required|check_exists:study-program.ScriptReviews,Id',
            'status' => 'required|in:' . $status,
            'newStatus' => 'required|in:' . $status,
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();

        if (!empty($data['status'])) {
            $data['status'] = QuarterReport::STATUS[$data['status']];
        }

        if (!empty($data['newStatus'])) {
            $data['newStatus'] = QuarterReport::STATUS[$data['newStatus']];
        }

        return $data;
    }

    public function messages()
    {
        return [
            'check_exists' => 'The selected :attribute is invalid.',
            'boolean' => 'The :attribute field must be true or false.',
            'array' => 'The :attribute must be an array.',
            'exists' => 'The selected :attribute is invalid.',
            'in' => 'The selected :attribute is invalid.',
        ];
    }
}
