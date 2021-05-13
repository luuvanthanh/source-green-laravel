<?php

namespace GGPHP\BusinessCard\Http\Requests;

use GGPHP\Absent\Models\AbsentType;
use GGPHP\BusinessCard\Models\BusinessCardDetail;
use Illuminate\Foundation\Http\FormRequest;

class CreatBusinessCardRequest extends FormRequest
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
            'absentTypeId' => 'required',
            'startDate' => 'required',
            'endDate' => 'required',
            'detail' => [
                'required',
                function ($attribute, $value, $fail) {

                    $absentType = AbsentType::find(request()->absentTypeId);

                    if ($absentType->Type === AbsentType::BUSINESS_TRAVEL) {

                        $accessAbsent = $this->checkDuplicateAbsent($value);

                        if (!is_null($accessAbsent)) {
                            return $fail("Bạn đã nghỉ vào ngày " . $accessAbsent);
                        }
                    }

                    return true;
                },
            ]];
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
            $businessCardDetail = BusinessCardDetail::where('Date', $item['date'])->whereHas('businessCard', function ($query) use ($employeeId) {
                $query->whereHas('absentType', function ($query) {
                    $query->where('Type', 'BUSINESS_TRAVEL');
                });

                $query->where('EmployeeId', $employeeId);
            })->get();

            $count = count($businessCardDetail);

            switch ($count) {
                case 1:
                    if ($businessCardDetail[0]->IsFullDate) {
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
