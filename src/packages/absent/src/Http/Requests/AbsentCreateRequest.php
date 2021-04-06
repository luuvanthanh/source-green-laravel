<?php

namespace GGPHP\Absent\Http\Requests;

use Carbon\Carbon;
use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Models\AbsentType;
use Illuminate\Foundation\Http\FormRequest;

class AbsentCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        $type = AbsentType::where('type', AbsentType::ANNUAL_LEAVE)->first();
        $quitWorkType = AbsentType::where('type', AbsentType::QUIT_WORK)->first();

        return [
            'absent_type_id' => [
                'required',
                'exists:absent_types,id',
            ],
            'absent_reason_id' => 'required|exists:absent_reasons,id',
            'user_id' => 'required|exists:users,id',
            'start_date' => [
                'date',
                'date_format:Y-m-d',
                function ($attribute, $value, $fail) use ($type, $quitWorkType) {
                    if (request('absent_type_id') == $quitWorkType->id) {
                        return true;
                    }
                    if (request('absent_type_id') == $type->id) {
                        $accessWeekend = $this->checkWeekend($value);
                        if ($accessWeekend === true) {
                            return true;
                        }
                        return $fail('Không được nghỉ vào thứ 6, thứ 7, chủ nhật');
                    }
                    return true;
                },
                function ($attribute, $value, $fail) use ($type, $quitWorkType) {
                    if (request('absent_type_id') == $quitWorkType->id) {
                        return true;
                    }

                    $accessAbsent = $this->checkDuplicateAbsent($value);

                    if (!is_null($accessAbsent)) {
                        return $fail("Bạn đã " . strtolower($accessAbsent['type']) . " vào ngày " . $accessAbsent['date']);
                    }

                    return true;
                },
            ],
            'end_date' => [
                'date',
                'date_format:Y-m-d',
                'after_or_equal:start_date',
                function ($attribute, $value, $fail) use ($type, $quitWorkType) {

                    if (request('absent_type_id') == $type->id) {
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
        $userId = request()->user_id;
        $annualLeaveType = AbsentType::where('type', AbsentType::ANNUAL_LEAVE)->first();
        $unpaidLeaveType = AbsentType::where('type', AbsentType::UNPAID_LEAVE)->first();

        $startDate = request()->start_date;
        $endDate = request()->end_date;
        $begin = new \DateTime($startDate);
        $end = new \DateTime($endDate . ' +1 day');

        $intervalDate = \DateInterval::createFromDateString('1 day');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);
        $listDateRequestAbsent = [];
        foreach ($periodDate as $date) {
            $listDateRequestAbsent[] = $date->format('Y-m-d');
        }

        $absent = Absent::whereIn('absent_type_id', [$annualLeaveType->id, $unpaidLeaveType->id])->where(function ($q2) use ($startDate, $endDate) {
            $q2->where([['start_date', '<=', $startDate], ['end_date', '>=', $endDate]])
                ->orWhere([['start_date', '>=', $startDate], ['start_date', '<=', $endDate]])
                ->orWhere([['end_date', '>=', $startDate], ['end_date', '<=', $endDate]]);
        })->where('user_id', $userId)->get();

        $result = $absent;
        foreach ($result as $value) {
            foreach ($listDateRequestAbsent as $dateRequest) {
                if ($value->start_date->format('Y-m-d') <= $dateRequest && $value->end_date->format('Y-m-d') >= $dateRequest) {
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
        $userId = request()->user_id;
        $startDate = Carbon::parse(request()->start_date);
        $endDate = Carbon::parse(request()->end_date);
        $early = AbsentType::where('type', AbsentType::ABSENT_EARLY)->first();
        $late = AbsentType::where('type', AbsentType::ABSENT_LATE)->first();

        $check = Absent::whereIn('absent_type_id', [$early->id, $late->id])->where(function ($q) use ($userId, $startDate, $endDate, $early, $late) {
            $q->where([['start_date', '<=', $startDate->firstOfMonth()->format('Y-m-d')], ['end_date', '>=', $startDate->endOfMonth()->format('Y-m-d')]])
                ->orWhere([['start_date', '>=', $startDate->firstOfMonth()->format('Y-m-d')], ['start_date', '<=', $startDate->endOfMonth()->format('Y-m-d')]])
                ->orWhere([['end_date', '>=', $startDate->firstOfMonth()->format('Y-m-d')], ['end_date', '<=', $startDate->endOfMonth()->format('Y-m-d')]]);
        })->where('user_id', $userId)->get();

        if (count($check) > 3) {
            return false;
        }

        return true;
    }
}
