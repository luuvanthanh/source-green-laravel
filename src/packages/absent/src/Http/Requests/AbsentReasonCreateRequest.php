<?php

namespace GGPHP\Absent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsentReasonCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required',
            'absentTypeId' => 'required|exists:AbsentTypes,Id',
        ];
    }
}
