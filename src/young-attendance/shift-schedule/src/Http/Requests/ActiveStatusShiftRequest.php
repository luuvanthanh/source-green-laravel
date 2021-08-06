<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Http\Requests;

use GGPHP\YoungAttendance\ShiftSchedule\Models\Shift;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class ActiveStatusShiftRequest extends FormRequest
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
                'required',
                function ($attribute, $value, $fail) {

                    if (request()->status === Shift::ON) {
                        $shift = Shift::where(['ShiftCode' => $value, 'Status' => Shift::ON])->first();

                        if (!is_null($shift)) {
                            return $fail("Không hợp lệ, trùng mã ca!");
                        }
                    }
                },
            ],
        ];
    }
}
