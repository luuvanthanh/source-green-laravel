<?php

namespace GGPHP\Absent\Http\Requests;

use Carbon\Carbon;
use GGPHP\Absent\Models\AbsentDetail;
use GGPHP\Category\Models\HolidayDetail;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use Illuminate\Foundation\Http\FormRequest;

class AbsentUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'absentTypeId' => 'required|exists:AbsentTypes,Id',
            'employeeId' => 'required|exists:Employees,Id',
            'startDate' => 'date|date_format:Y-m-d',
            'endDate' => 'date|date_format:Y-m-d|after_or_equal:startDate',
            'detail' => [
                function ($attribute, $value, $fail) {

                    $accessAbsent = $this->checkDuplicateAbsent($value);

                    if (!is_null($accessAbsent)) {
                        $date = Carbon::parse($accessAbsent)->setTimezone('GMT+7')->format('d-m-Y');
                        return $fail("Bạn đã nghỉ vào ngày " . $date);
                    }

                    $checkShift = $this->checkShift($value);
                    if (!is_null($checkShift)) {
                        $date = Carbon::parse($checkShift)->setTimezone('GMT+7')->format('d-m-Y');
                        return $fail("Ngày $date không có ca làm việc");
                    }

                    foreach ($value as $key => $item) {

                        $accessSameHoliday = $this->checkSameHoliday($item);

                        if ($accessSameHoliday !== true) {
                            return $fail("Không được đăng ký vào ngày lễ " . $accessSameHoliday);
                        }
                    }


                    return true;
                },
            ],
        ];
    }

    /**
     * @param $value
     * @return bool|string
     */
    private function checkDuplicateAbsent($value)
    {
        $employeeId = request()->employeeId;
        foreach ($value as $item) {
            $absentDetails = AbsentDetail::where('Date', $item['date'])->whereHas('absent', function ($query) use ($employeeId) {
                $query->where('EmployeeId', $employeeId);
                $query->where('Id', '!=', requaet()->id);
            })->get();

            $count = count($absentDetails);

            switch ($count) {
                case 1:
                    if ($absentDetails[0]->IsFullDate) {
                        return $item['date'];
                    }
                    if ($item['isFullDate']) {
                        return $item['date'];
                    }

                    break;
                case 2:
                    return $item['date'];
                    break;
            }
        }

        return null;
    }

    private function checkShift($value)
    {
        $employeeId = request()->employeeId;

        foreach ($value as $item) {
            $shifts = ScheduleRepositoryEloquent::getUserTimeWorkShift($employeeId, $item['date'], $item['date']);

            if (empty($shifts)) {
                return $item['date'];
            }
        }

        return null;
    }

    /**
     * @param $value
     * @return bool|string
     */
    private function checkSameHoliday($value)
    {
        $value = Carbon::parse($value['date'])->format('Y-m-d');
        $holiday = HolidayDetail::where('StartDate', '<=', $value)->where('EndDate', '>=', $value)->first();

        if (!is_null($holiday)) {
            return $value;
        }

        return true;
    }
}
