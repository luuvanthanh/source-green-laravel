<?php

namespace GGPHP\BusinessCard\Http\Requests;

use Carbon\Carbon;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\BusinessCard\Models\BusinessCardDetail;
use GGPHP\Category\Models\HolidayDetail;
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

                        $accessAbsent = $this->checkDuplicateBusinessCardBusinessTravel($value);

                        if (!is_null($accessAbsent)) {
                            $accessAbsent = Carbon::parse($accessAbsent)->format('d-m-Y');
                            return $fail("Bạn đã có lịch đi công tác vào ngày " . $accessAbsent);
                        }
                    }

                    if ($absentType->Type === AbsentType::GO_OUT) {

                        $accessAbsent = $this->checkDuplicateBusinessCardGoOut($value);

                        if (!is_null($accessAbsent)) {
                            return $fail("Đơn đi ra ngoài vào thời gian " . $accessAbsent . " đã tồn tại");
                        }
                    }

                    foreach ($value as $key => $item) {
                        $accessSameHoliday = $this->checkSameHoliday($item);

                        if ($accessSameHoliday !== true) {
                            return $fail("Không được đăng ký vào ngày lễ " . $accessSameHoliday);
                        }
                    }

                    return true;
                },
            ]
        ];
    }

    /**
     * @param $value
     * @return bool|string
     */
    private function checkDuplicateBusinessCardBusinessTravel($value)
    {
        $employeeId = request()->employeeId;
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
                    if (($item['startTime'] <= $businessCardDetail[0]->StartTime && $item['endTime'] >= $businessCardDetail[0]->StartTime)
                        || ($item['startTime'] >= $businessCardDetail[0]->StartTime && $item['endTime'] <= $businessCardDetail[0]->EndTime)
                        || ($item['startTime'] <= $businessCardDetail[0]->EndTime && $item['endTime'] >= $businessCardDetail[0]->EndTime)
                    ) {
                        return $item['date'];
                    }

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

    /**
     * @param $value
     * @return bool|string
     */
    private function checkDuplicateBusinessCardGoOut($value)
    {
        $employeeId = request()->employeeId;
        foreach ($value as $item) {
            $businessCardDetails = BusinessCardDetail::where('Date', $item['date'])->whereHas('businessCard', function ($query) use ($employeeId) {
                $query->whereHas('absentType', function ($query) {
                    $query->where('Type', 'GO_OUT');
                });

                $query->where('EmployeeId', $employeeId);
            })->get();

            foreach ($businessCardDetails as $key => $businessCardDetail) {
                if (($item['startTime'] <= $businessCardDetail->StartTime && $item['endTime'] >= $businessCardDetail->StartTime)
                    || ($item['startTime'] >= $businessCardDetail->StartTime && $item['endTime'] <= $businessCardDetail->EndTime)
                    || ($item['startTime'] <= $businessCardDetail->EndTime && $item['endTime'] >= $businessCardDetail->EndTime)
                ) {
                    return $item['startTime'] . " - " . $item['endTime'];
                }
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
