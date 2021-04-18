<?php

namespace GGPHP\ShiftSchedule\Http\Requests;

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
                        if ($value[$i]['StartTime'] <= $value[$i - 1]['EndTime']) {
                            return $fail('Thời gian không hợp lệ.');
                        }
                        if ($value[$i]['StartTime'] > $value[$i]['EndTime'] && $value[$i]['EndTime'] > $value[0]['StartTime']) {
                            return $fail('Thời gian không hợp lệ.');
                        }
                    }
                },
            ],
        ];
    }
}
