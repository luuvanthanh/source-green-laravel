<?php

namespace GGPHP\Users\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
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
            'name' => [
                'string',
                function ($attribute, $value, $fail) {
                    $shift = LabourContract::where('ContractNumber', $value)->where('Id', '!=', request()->id)->first();

                    if (!is_null($shift)) {
                        return $fail('Số hợp đồng đã tồn tại.');
                    }
                },
            ],
        ];
    }
}
