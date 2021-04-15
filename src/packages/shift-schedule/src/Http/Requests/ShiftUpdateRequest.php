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
            'shift_code' => [
                'string',
                Rule::unique('shifts')->ignore($this->id)->where(function ($query) use ($store_id) {
                    $query->where(['status' => Shift::ON]);
                }),
            ],
            'shift_id' => [
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

                        if ($value[$i]['start_time'] <= $value[$i - 1]['end_time']) {
                            return $fail('Thời gian không hợp lệ.');
                        }

                        if ($value[$i]['start_time'] > $value[$i]['end_time']) {
                            if ($value[$i]['end_time'] > $value[0]['start_time']) {
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
    private function checkAccessUpdate($shift_id)
    {
        $now = Carbon::now();
        $today = $now->toDateString();

        $scheduleDetail = Schedule::where('shift_id', $shift_id)->whereDate('start_date', '<=', date($today))->get();
        if (empty(count($scheduleDetail))) {
            return true;
        }
        return false;
    }
}
