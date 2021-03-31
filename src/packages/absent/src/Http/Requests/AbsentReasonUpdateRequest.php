<?php

namespace GGPHP\Absent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsentReasonUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required',
            'absent_type_id' => 'required|exists:absent_types,id',
        ];
    }
}
