<?php

namespace GGPHP\Refund\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RefundCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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
            'SchoolYearId' => 'required|uuid|check_exists:fee.SchoolYears,Id'
        ];
    }
}
