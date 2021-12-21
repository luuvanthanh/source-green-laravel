<?php

namespace GGPHP\WorkHour\Http\Requests;

use Carbon\Carbon;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\WorkHour\Models\WorkHour;
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

                    $workHours = WorkHour::where('Date', $date)->where('EmployeeId', $employeeId)->get();
                    foreach ($value as $valueItem) {
                        if ($valueItem['out'] <= $valueItem['in']) {
                            return $fail('Thời gian kết thúc phải lớn hơn thời gian bắt đầu.');
                        }
                        $check = Carbon::parse($date)->format('l');

                        if (!empty($shifts) && $check !== 'Saturday' && $check !== 'Sunday') {
                            foreach ($shifts as $shift) {
                                foreach ($shift as $item) {

                                    if (($valueItem['in'] <= $item['StartTime'] && $valueItem['out'] >= $item['StartTime'])
                                        || ($valueItem['in'] >= $item['StartTime'] && $valueItem['out'] <= $item['EndTime'])
                                        || ($valueItem['in'] <= $item['EndTime'] && $valueItem['out'] >= $item['EndTime'])
                                    ) {
                                        return $fail('Thời gian không được trùng với ca làm việc');
                                    }
                                }
                            }
                        }

                        foreach ($workHours as $workHour) {
                            $hours = json_decode($workHour->Hours);

                            foreach ($hours as $hour) {
                                if (($valueItem['in'] <= $hour->in && $valueItem['out'] >= $hour->in)
                                    || ($valueItem['in'] >= $hour->in && $valueItem['out'] <= $hour->out)
                                    || ($valueItem['in'] <= $hour->out && $valueItem['out'] >= $hour->out)
                                ) {
                                    return $fail('Thời gian trùng với thời gian đã tạo đơn làm thêm');
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
