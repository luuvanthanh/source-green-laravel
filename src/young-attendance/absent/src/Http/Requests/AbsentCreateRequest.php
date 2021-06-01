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

        return [
            'absentTypeId' => [
                'required',
                'exists:AbsentTypeStudents,Id',
            ],
            'absentReasonId' => 'required|exists:AbsentReasonStudents,Id',
            'parentId' => 'required',
            'studentId' => 'required',
            'startDate' => [
                'date',
                'date_format:Y-m-d',
                function ($attribute, $value, $fail) {

                    $now = Carbon::now();

                    if (Carbon::parser($value)->format('Y-m-d') < $now->format('Y-m-d')) {
                        return $fail("Ngày bắt đầu không được nhỏ hơn ngày hiện tại");
                    }

                    $accessAbsent = $this->checkDuplicateAbsent($value);

                    if (!is_null($accessAbsent)) {
                        return $fail("Học sinh đã đăng ký" . strtolower($accessAbsent['type']) . " vào ngày " . $accessAbsent['date']);
                    }

                    return true;
                },
            ],
            'endDate' => [
                'date',
                'date_format:Y-m-d',
                'after_or_equal:startDate',
            ],
        ];
    }

    /**
     * @param $value
     * @return bool|string
     */
    private function checkDuplicateAbsent($value)
    {
        $studentId = request()->StudentId;
        $annualLeaveType = AbsentType::where('Type', AbsentType::ANNUAL_LEAVE)->first();

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

        $absent = Absent::whereIn('AbsentTypeId', [$annualLeaveType->Id])->where(function ($q2) use ($startDate, $endDate) {
            $q2->where([['StartDate', '<=', $startDate], ['EndDate', '>=', $endDate]])
                ->orWhere([['StartDate', '>=', $startDate], ['StartDate', '<=', $endDate]])
                ->orWhere([['EndDate', '>=', $startDate], ['EndDate', '<=', $endDate]]);
        })->where('StudentId', $studentId)->get();

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
}
