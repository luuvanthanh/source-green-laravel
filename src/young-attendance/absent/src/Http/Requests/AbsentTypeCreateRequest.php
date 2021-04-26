<?php

namespace GGPHP\YoungAttendance\Absent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsentTypeCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $absentType = implode(',', config('constants-absent.ABSENT_TYPE'));

        return [
            'name' => 'required',
            'status' => 'required|string|in:' . $absentType,
        ];
    }
}
