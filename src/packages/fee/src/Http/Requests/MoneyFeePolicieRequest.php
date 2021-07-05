<?php

namespace GGPHP\Fee\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MoneyFeePolicieRequest extends FormRequest
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
            'classTypeId' => 'required',
            'schooleYearId' => 'required',
            'paymentFormId' => 'required',
            'feeId' => 'required',
            'student' => 'required',
            'dayAdmission' => 'required',
        ];
    }
}
