<?php

namespace GGPHP\WorkHour\Http\Requests;

use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use Illuminate\Foundation\Http\FormRequest;

class CreatWorkHourRequest extends FormRequest
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
            'employeeId' => 'required|exists:Employees,Id',
            'date' => 'required|after_or_equal:today',
            'hours' => [
                'required',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $date = request()->date;
                    $shifts = ScheduleRepositoryEloquent::getUserTimeWorkShift($employeeId, $date, $date);

                    $value = $value[0];

                    if (!empty($shifts)) {
                        foreach ($shifts as $shift) {
                            foreach ($shift as $item) {

                                if (($value['in'] <= $item['StartTime'] && $value['out'] >= $item['StartTime'])
                                    || ($value['in'] >= $item['StartTime'] && $value['out'] <= $item['EndTime'])
                                    || ($value['in'] <= $item['EndTime'] && $value['out'] >= $item['EndTime'])
                                ) {
                                    return $fail('Thời gian không được trùng với ca làm việc');
                                }
                            }
                        }
                    }
                },
            ],
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'date.after_or_equal' => "Trường phải là một ngày sau ngày hiện tại.",
        ];
    }
}
