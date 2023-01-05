<?php

namespace GGPHP\ChildDevelop\TestSemester\Http\Requests;

use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use Illuminate\Foundation\Http\FormRequest;

class ApprovedTestSemesterRequest extends FormRequest
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
        $approvalStatus = implode(',', array_keys(TestSemester::APPROVAL_STATUS));

        return [
            'id' => 'required|array|exists:TestSemesters,Id',
            'approvalStatus' => 'required|in:' . $approvalStatus,
        ];
    }
}
