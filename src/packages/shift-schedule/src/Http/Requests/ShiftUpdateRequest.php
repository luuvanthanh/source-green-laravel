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
        $store_id = $request->store_id;
        return [
            'shiftCode' => [
                'string',
                Rule::unique('Shifts')->ignore($this->Id)->where(function ($query) use ($store_id) {
                    $query->where(['Status' => Shift::ON]);
                }),
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
                    for ($i = 1; $i < count($value); $i++) {

                        if ($value[$i]['StartTime'] <= $value[$i - 1]['EndTime']) {
                            return $fail('Thời gian không hợp lệ.');
                        }

                        if ($value[$i]['StartTime'] > $value[$i]['EndTime']) {
                            if ($value[$i]['EndTime'] > $value[0]['StartTime']) {
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
