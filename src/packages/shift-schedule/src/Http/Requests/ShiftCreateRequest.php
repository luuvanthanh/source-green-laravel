<?php

namespace GGPHP\ShiftSchedule\Http\Requests;

use GGPHP\ShiftSchedule\Models\Shift;
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
            'ShiftCode' => [
                'required',
                'string',
                Rule::unique('Shifts')->where(function ($query) {
                    $query->where(['Status' => Shift::ON]);
                }),
            ],
            'Description' => 'string',
            'Time' => ['required', 'array',
                function ($attribute, $value, $fail) {
                    for ($i = 1; $i < count($value); $i++) {
                        if ($value[$i]['start_time'] <= $value[$i - 1]['end_time']) {
                            return $fail('Thời gian không hợp lệ.');
                        }
                        if ($value[$i]['start_time'] > $value[$i]['end_time'] && $value[$i]['end_time'] > $value[0]['start_time']) {
                            return $fail('Thời gian không hợp lệ.');
                        }
                    }
                },
            ],
        ];
    }
}
