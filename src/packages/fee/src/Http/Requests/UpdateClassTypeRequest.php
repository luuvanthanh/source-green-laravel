<?php

namespace GGPHP\Fee\Http\Requests;

use GGPHP\Fee\Models\ClassType;
use Illuminate\Foundation\Http\FormRequest;

class UpdateClassTypeRequest extends FormRequest
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
    public function rules()
    {
        return [
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $shift = ClassType::where('Code', $value)->where('Id', '!=', request()->id)->first();

                    if (!is_null($shift)) {
                        return $fail('Mã đã tồn tại.');
                    }
                },
            ],
        ];
    }
}
