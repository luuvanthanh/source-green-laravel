<?php

namespace GGPHP\StudyProgram\AttendancePhysical\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttendancePhysicalCreateRequest extends FormRequest
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
            'branchId' => 'required',
            'classId' => 'required',
            'physicalStudyProgramId' => 'required',
            'physicalStudyProgramSessionId' => 'required',
            'studentId' => 'required'
        ];
    }
}
