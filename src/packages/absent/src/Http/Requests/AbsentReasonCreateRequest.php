<?php

namespace GGPHP\Absent\Http\Requests;

use GGPHP\Absent\Models\AbsentType;
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
            'absentTypeId' =>
            ['required',
                'exists:absent_types,Id',
                function ($attribute, $value, $fail) {
                    $checkStatus = $this->checkAccessUpdate($value);
                    if ($checkStatus) {
                        return true;
                    }
                    return $fail('The selected AbsentTypeId is not active.');
                },
            ],
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
