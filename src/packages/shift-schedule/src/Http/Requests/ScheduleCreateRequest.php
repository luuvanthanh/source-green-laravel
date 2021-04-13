<?php

namespace GGPHP\ShiftSchedule\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScheduleCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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
            'start_date' => [
                'required', 'date',
            ],
            'user_id' => 'required|exists:employees,id',
            'shift_id' => 'required|exists:shifts,id',
        ];
    }

}
