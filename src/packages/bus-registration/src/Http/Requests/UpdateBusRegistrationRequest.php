<?php

namespace GGPHP\BusRegistration\Http\Requests;

use Carbon\Carbon;
use GGPHP\Category\Models\HolidayDetail;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBusRegistrationRequest extends FormRequest
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
            'hourNumber' => [
                function ($attribute, $value, $fail) {

                    if ($value < 0) {
                        return $fail('Trường dữ liệu phải lớn hơn 0.');
                    }
                },
            ],
            'detail' => [
                function ($attribute, $value, $fail) {
                    foreach ($value as $key => $item) {
                        $accessWeekend = $this->checkWeekend($item['date']);

                        if ($accessWeekend === false) {
                            return $fail('Không được đăng ký vào thứ 7, chủ nhật');
                        }

                        $accessSameHoliday = $this->checkSameHoliday($item['date']);
                        if ($accessSameHoliday !== true) {
                            return $fail('Không được đăng ký vào ngày lễ ' . $accessSameHoliday);
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
    private function checkSameHoliday($value)
    {
        $value = Carbon::parse($value)->format('Y-m-d');
        $holiday = HolidayDetail::where('StartDate', '<=', $value)->where('EndDate', '>=', $value)->first();

        if (!is_null($holiday)) {
            return $value;
        }

        return true;
    }

    /**
     * @param $value
     * @return bool
     */
    private function checkWeekend($value)
    {
        $check = Carbon::parse($value)->format('l');
        if ($check === 'Saturday' || $check === 'Sunday') {
            return false;
        }

        return true;
    }
}
