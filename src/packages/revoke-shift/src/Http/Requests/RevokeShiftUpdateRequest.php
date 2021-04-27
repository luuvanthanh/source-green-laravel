<?php

namespace GGPHP\RevokeShift\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RevokeShiftUpdateRequest extends FormRequest
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
            'name' => 'string',
        ];
    }
}
