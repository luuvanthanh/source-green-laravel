<?php

namespace GGPHP\ShiftSchedule\Http\Requests;

use Carbon\Carbon;
use GGPHP\ShiftSchedule\Models\Schedule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ShiftDeleteRequest extends FormRequest
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
            'shift_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $accessUpdate = $this->checkAccessDelete($value);
                    if ($accessUpdate) {
                        return true;
                    }
                    return $fail('Dữ liệu đang được sử dụng');
                },
            ],
        ];
    }

    /**
     * Check shift is access delete
     *
     * @return boolean
     */
    private function checkAccessDelete($shift_id)
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
