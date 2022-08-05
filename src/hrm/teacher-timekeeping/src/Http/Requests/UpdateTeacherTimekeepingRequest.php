<?php

namespace GGPHP\TeacherTimekeeping\Http\Requests;

use GGPHP\TeacherTimekeeping\Models\TeacherTimekeeping;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherTimekeepingRequest extends FormRequest
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
            'employeeId' => 'exists:Employees,Id',
            'type' => 'string|in:' . $type,
            'status' => 'string|in:' . $status,
            'attendedAt' => 'date|date_format:Y-m-d H:i:s',
            'startTime' => 'date_format:H:i:s'
        ];
    }
}
