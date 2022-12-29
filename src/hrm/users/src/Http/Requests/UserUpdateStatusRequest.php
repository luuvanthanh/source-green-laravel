<?php

namespace GGPHP\Users\Http\Requests;

use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\Users\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UserUpdateStatusRequest extends FormRequest
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
            'status' => 'required|in:WORKING,INACTIVITY,MATERNITY,STORE',
            'id' =>  [
                'required',
                function ($attribute, $value, $fail) {
                    $resignationDecision = ResignationDecision::where('EmployeeId', $value)->first();

                    if (!is_null($resignationDecision)) {
                        return $fail('Tồn tại QĐ thôi việc, không khôi phục được hồ sơ. Vui lòng kiểm tra lại.');
                    }

                    return true;
                },
            ],
        ];
    }
}
