<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScheduleCreateRequest extends FormRequest
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
        return [
            'startDate' => [
                'required', 'date',
            ],
            'studentId' => 'required',
            'shiftId' => 'required|exists:ShiftStudents,Id',
        ];
    }
}
