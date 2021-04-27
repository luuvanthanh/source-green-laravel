<?php

namespace GGPHP\Profile\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrCreateSabbaticalLeaveRequest extends FormRequest
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
            'employeeId' => 'required|exists:Employees,Id',
            'annualLeave' => 'required|integer',
        ];
    }
}
