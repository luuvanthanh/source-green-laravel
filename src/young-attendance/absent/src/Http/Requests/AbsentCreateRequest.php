<?php

namespace GGPHP\YoungAttendance\Absent\Http\Requests;

use Carbon\Carbon;
use GGPHP\YoungAttendance\Absent\Models\Absent;
use GGPHP\YoungAttendance\Absent\Models\AbsentType;
use Illuminate\Foundation\Http\FormRequest;

class AbsentCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        $type = AbsentType::where('Type', AbsentType::ANNUAL_LEAVE)->first();
        $quitWorkType = AbsentType::where('Type', AbsentType::QUIT_WORK)->first();

        return [
            'absentTypeId' => [
                'required',
                'exists:AbsentTypes,Id',
            ],
            'absentReasonId' => 'required|exists:AbsentReasons,Id',
            'parentId' => 'required',
            'studentId' => 'required',
            'startDate' => [
                'date',
                'date_format:Y-m-d',
                function ($attribute, $value, $fail) use ($type, $quitWorkType) {
                    if (request('absentTypeId') == $quitWorkType->Id) {
                        return true;
                    }
                    if (request('absentTypeId') == $type->Id) {
                        $accessWeekend = $this->checkWeekend($value);
                        if ($accessWeekend === true) {
                            return true;
                        }
                        return $fail('Không được nghỉ vào thứ 6, thứ 7, chủ nhật');
                    }
                    return true;
                },
                function ($attribute, $value, $fail) use ($type, $quitWorkType) {
                    if (request('absentTypeId') == $quitWorkType->Id) {
                        return true;
                    }

                    $accessAbsent = $this->checkDuplicateAbsent($value);

                    if (!is_null($accessAbsent)) {
                        return $fail("Bạn đã " . strtolower($accessAbsent['type']) . " vào ngày " . $accessAbsent['date']);
                    }

                    return true;
                },
            ],
            'endDate' => [
                'date',
                'date_format:Y-m-d',
                'after_or_equal:startDate',
                function ($attribute, $value, $fail) use ($type, $quitWorkType) {

                    if (request('absentTypeId') == $type->Id) {
                        $accessWeekend = $this->checkWeekend($value);
                        if ($accessWeekend === true) {
                            return true;
                        }
                        return $fail('Không được nghỉ vào thứ 6, thứ 7, chủ nhật');
                    }
                    return;
                },
            ],
        ];
    }

    /**
     * @param $value
     * @return bool
     */
    private function checkWeekend($value)
    {
        $check = Carbon::parse($value)->format('l');
        if ($check === 'Friday' || $check === 'Saturday' || $check === 'Sunday') {
            return false;
        }

        return true;
    }

    /**
     * @param $value
     * @return bool|string
     */
    private function checkDuplicateAbsent($value)
    {
        $parentId = request()->ParentId;
        $annualLeaveType = AbsentType::where('Type', AbsentType::ANNUAL_LEAVE)->first();
        $unpaidLeaveType = AbsentType::where('Type', AbsentType::UNPAID_LEAVE)->first();

        $startDate = request()->startDate;
        $endDate = request()->endDate;
        $begin = new \DateTime($startDate);
        $end = new \DateTime($endDate . ' +1 day');

        $intervalDate = \DateInterval::createFromDateString('1 day');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);
        $listDateRequestAbsent = [];
        foreach ($periodDate as $date) {
            $listDateRequestAbsent[] = $date->format('Y-m-d');
        }

        $absent = Absent::whereIn('AbsentTypeId', [$annualLeaveType->Id, $unpaidLeaveType->Id])->where(function ($q2) use ($startDate, $endDate) {
            $q2->where([['StartDate', '<=', $startDate], ['EndDate', '>=', $endDate]])
                ->orWhere([['StartDate', '>=', $startDate], ['StartDate', '<=', $endDate]])
                ->orWhere([['EndDate', '>=', $startDate], ['EndDate', '<=', $endDate]]);
        })->where('ParentId', $parentId)->get();

        $result = $absent;
        foreach ($result as $value) {
            foreach ($listDateRequestAbsent as $dateRequest) {
                if ($value->StartDate->format('Y-m-d') <= $dateRequest && $value->EndDate->format('Y-m-d') >= $dateRequest) {
                    return [
                        "date" => date('d-m-Y', strtotime($dateRequest)),
                        "type" => $value->absentType->name,
                    ];
                }
            }
        }

        return null;
    }

    public function checkMaxAbsentEarlyLateInMonth($value)
    {
        $parentId = request()->ParentId;
        $startDate = Carbon::parse(request()->startDate);
        $endDate = Carbon::parse(request()->endDate);
        $early = AbsentType::where('Type', AbsentType::ABSENT_EARLY)->first();
        $late = AbsentType::where('Type', AbsentType::ABSENT_LATE)->first();

        $check = Absent::whereIn('absentTypeId', [$early->Id, $late->Id])->where(function ($q) use ($parentId, $startDate, $endDate, $early, $late) {
            $q->where([['StartDate', '<=', $startDate->firstOfMonth()->format('Y-m-d')], ['EndDate', '>=', $startDate->endOfMonth()->format('Y-m-d')]])
                ->orWhere([['StartDate', '>=', $startDate->firstOfMonth()->format('Y-m-d')], ['StartDate', '<=', $startDate->endOfMonth()->format('Y-m-d')]])
                ->orWhere([['EndDate', '>=', $startDate->firstOfMonth()->format('Y-m-d')], ['EndDate', '<=', $startDate->endOfMonth()->format('Y-m-d')]]);
        })->where('ParentId', $parentId)->get();

        if (count($check) > 3) {
            return false;
        }

        return true;
    }
}
