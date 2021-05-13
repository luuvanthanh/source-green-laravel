<?php

namespace GGPHP\Absent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsentTypeCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required',
        ];
    }
}
