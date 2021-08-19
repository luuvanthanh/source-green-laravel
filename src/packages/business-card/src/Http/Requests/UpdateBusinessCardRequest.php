<?php

namespace GGPHP\BusinessCard\Http\Requests;

use Carbon\Carbon;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\BusinessCard\Models\BusinessCardDetail;
use GGPHP\Category\Models\HolidayDetail;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessCardRequest extends FormRequest
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
            'detail' => [
                function ($attribute, $value, $fail) {

                    $absentType = AbsentType::find(request()->absentTypeId);

                    if ($absentType->Type === AbsentType::BUSINESS_TRAVEL) {

                        $accessAbsent = $this->checkDuplicateBusinessCard($value);

                        if (!is_null($accessAbsent)) {
                            return $fail("Bạn đã có lịch đi công tác vào ngày " . $accessAbsent);
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
    private function checkDuplicateBusinessCard($value)
    {
        $employeeId = request()->employeeId;
        foreach ($value as $item) {
            $businessCardDetail = BusinessCardDetail::where('Date', $item['date'])->whereHas('businessCard', function ($query) use ($employeeId) {
                $query->whereHas('absentType', function ($query) {
                    $query->where('Type', 'BUSINESS_TRAVEL');
                    $query->where('Id', '!=', request()->id);
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
