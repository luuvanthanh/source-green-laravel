<?php

namespace GGPHP\Absent\Http\Requests;

use GGPHP\Absent\Models\AbsentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
            'absent_type_id' =>
                ['required',
                'exists:absent_types,id',
                function ($attribute, $value, $fail) {
                    $checkStatus = $this->checkAccessUpdate($value);
                    if ($checkStatus) {
                        return true;
                    }
                    return $fail('The selected absent_type_id is not active.');
                },
            ]
        ];
    }

    public function checkAccessUpdate($value)
    {
        $status = AbsentType::find($value)->status;
        if ($status === AbsentType::ON) {
            return true;
        }

        return false;
    }
}
