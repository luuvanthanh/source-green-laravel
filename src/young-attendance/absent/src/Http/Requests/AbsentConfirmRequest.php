<?php

namespace GGPHP\YoungAttendance\Absent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsentConfirmRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'status' => 'required',
        ];
    }
}
