<?php

namespace GGPHP\Absent\Http\Requests;

use GGPHP\Absent\Models\AbsentDetail;
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
            ],
            'endDate' => [
                'date',
                'date_format:Y-m-d',
                'after_or_equal:startDate',
            ],
            'detail' => [
                'required',
                function ($attribute, $value, $fail) {

                    $accessAbsent = $this->checkDuplicateAbsent($value);

                    if (!is_null($accessAbsent)) {
                        return $fail("Bạn đã nghỉ vào ngày " . $accessAbsent);
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
        $startDate = request()->startDate;
        $endDate = request()->endDate;
        $result = [];
        foreach ($value as $item) {
            $absentDetails = AbsentDetail::where('Date', $item['date'])->whereHas('absent', function ($query) use ($employeeId) {
                $query->where('EmployeeId', $employeeId);
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
}
