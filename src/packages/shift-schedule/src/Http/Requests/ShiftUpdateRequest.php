<?php

namespace GGPHP\ShiftSchedule\Http\Requests;

use Carbon\Carbon;
use GGPHP\ShiftSchedule\Models\Schedule;
use GGPHP\ShiftSchedule\Models\Shift;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ShiftUpdateRequest extends FormRequest
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
    public function rules(Request $request)
    {
        return [
            'shiftCode' => [
                'string',
                function ($attribute, $value, $fail) {
                    $shift = Shift::where('ShiftCode', $value)->where('Status', 'ON')->where('Id', '!=', request()->id)->first();

                    if (!is_null($shift)) {
                        return $fail('Mã ca đã tồn tại.');
                    }
                },
            ],
            'shiftId' => [
                'required',
                function ($attribute, $value, $fail) {
                    $accessUpdate = $this->checkAccessUpdate($value);
                    if ($accessUpdate) {
                        return true;
                    }
                    return $fail('Dữ liệu đang được sử dụng');
                },
            ],
            'time' => [
                'array',
                function ($attribute, $value, $fail) {
                    for ($i = 0; $i < count($value); $i++) {

                        if ($value[$i]['endTime'] <= $value[$i]['startTime']) {
                            return $fail('Thời gian kết thúc phải lớn hơn thời gian bắt đầu.');
                        }

                        if ($value[$i]['afterStart'] <= $value[$i]['startTime']) {
                            return $fail('Thời gian đi trễ  phải lớn hơn thời gian bắt đầu.');
                        }

                        if ($value[$i]['beforeEnd'] >= $value[$i]['endTime']) {
                            return $fail('Thời gian về sớm phải nhỏ hơn thời gian kết thúc.');
                        }

                        if ($value[$i]['startTime'] <= $value[$i - 1]['endTime']) {
                            return $fail('Thời gian không hợp lệ.');
                        }

                        if ($value[$i]['startTime'] > $value[$i]['endTime']) {
                            if ($value[$i]['endTime'] > $value[0]['startTime']) {
                                return $fail('Thời gian không hợp lệ.');
                            }
                        }
                    }
                },
            ],
        ];
    }

    /**
     * Check shift is access update
     *
     * @return boolean
     */
    private function checkAccessUpdate($ShiftId)
    {
        $now = Carbon::now();
        $today = $now->toDateString();

        $scheduleDetail = Schedule::where('ShiftId', $ShiftId)->whereDate('StartDate', '<=', date($today))->get();
        if (empty(count($scheduleDetail))) {
            return true;
        }
        return false;
    }
}
