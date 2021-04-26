<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ShiftCreateRequest extends FormRequest
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
                'string',
            ],
            'description' => 'string',
            'time' => ['required', 'array',
                function ($attribute, $value, $fail) {
                    for ($i = 1; $i < count($value); $i++) {
                        if ($value[$i]['startTime'] <= $value[$i - 1]['endTime']) {
                            return $fail('Thời gian không hợp lệ.');
                        }
                        if ($value[$i]['startTime'] > $value[$i]['endTime'] && $value[$i]['endTime'] > $value[0]['startTime']) {
                            return $fail('Thời gian không hợp lệ.');
                        }
                    }
                },
            ],
        ];
    }
}
