<?php

namespace GGPHP\ShiftSchedule\Http\Requests;

use GGPHP\ShiftSchedule\Models\Shift;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
    public function rules()
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
