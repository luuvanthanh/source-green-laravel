<?php

namespace GGPHP\Salary\Http\Requests;

use GGPHP\Salary\Models\Payroll;
use Illuminate\Foundation\Http\FormRequest;

class PayslipRequest extends FormRequest
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
            'id' => [
                'required',
                // function ($attribute, $value, $fail) {
                //     $payroll = Payroll::findOrFail($value);

                //     if (!$payroll->IsTimesheet || !$payroll->IsBonus || !$payroll->IsOther) {
                //         return $fail('Chưa đủ điều kiện để  tính lương tháng!');
                //     }

                // },
            ],
        ];
    }
}
