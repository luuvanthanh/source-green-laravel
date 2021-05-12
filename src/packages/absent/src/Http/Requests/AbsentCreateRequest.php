<?php

namespace GGPHP\Absent\Http\Requests;

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
        return [
            'absentTypeId' => [
                'required',
                'exists:AbsentTypes,Id',
            ],
            'employeeId' => 'required|exists:Employees,Id',
            'startDate' => [
                'date',
                'date_format:Y-m-d',
                function ($attribute, $value, $fail) {

                    // $accessAbsent = $this->checkDuplicateAbsent($value);

                    // if (!is_null($accessAbsent)) {
                    //     return $fail("Bạn đã " . strtolower($accessAbsent['type']) . " vào ngày " . $accessAbsent['date']);
                    // }

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
        $employeeId = request()->EmployeeId;
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
        })->where('EmployeeId', $employeeId)->get();

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
