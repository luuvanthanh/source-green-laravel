<?php

namespace GGPHP\Crm\Fee\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStatusChargeStudentRequest extends FormRequest
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
            '*.charge_student_id' => 'required|exists:charge_students,id|distinct',
            '*.status' => 'required|in:PAYING,PAID'
        ];
    }
}
