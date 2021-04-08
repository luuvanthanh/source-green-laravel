<?php

namespace GGPHP\WorkHour\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatWorkHourRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'hours' => 'required',
        ];
    }
}
