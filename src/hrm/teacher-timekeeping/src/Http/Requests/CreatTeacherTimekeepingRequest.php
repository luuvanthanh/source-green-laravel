<?php

namespace GGPHP\TeacherTimekeeping\Http\Requests;

use GGPHP\TeacherTimekeeping\Models\TeacherTimekeeping;
use Illuminate\Foundation\Http\FormRequest;

class CreatTeacherTimekeepingRequest extends FormRequest
{
    /**
     * Determine if the employee is authorized to make this request.
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
        $type = implode(',', array_keys(TeacherTimekeeping::TYPE));
        $status = implode(',', array_keys(TeacherTimekeeping::STATUS));

        return [
            'employeeId' => 'required|exists:Employees,Id',
            'type' => 'required|string|in:' . $type,
            'status' => 'required|string|in:' . $status,
            'attendedAt' => 'required|date|date_format:Y-m-d H:i:s',
            'startTime' => 'required|date_format:H:i:s'
        ];
    }
}
