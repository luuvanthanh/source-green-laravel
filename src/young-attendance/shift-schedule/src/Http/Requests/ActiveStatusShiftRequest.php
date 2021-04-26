<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Http\Requests;

use GGPHP\YoungAttendance\ShiftSchedule\Models\Shift;
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
    public function rules(Request $request)
    {
        $checkUnique = [];

        if ($request->status === Shift::ON) {
            $checkUnique = Rule::unique('Shifts')->where(function ($query) use ($request) {
                $query->where(['shiftCode' => $request->shift_code, 'Status' => Shift::ON]);
            });
        }
        return [
            'shiftCode' => [
                'required', $checkUnique,
            ],
        ];
    }
}
