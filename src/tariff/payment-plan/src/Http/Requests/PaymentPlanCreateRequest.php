<?php

namespace GGPHP\Tariff\PaymentPlan\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentPlanCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'chargeMonth' => 'date_format:Y-m-d',
            'datePlan' => 'date_format:Y-m-d',
            'schoolYearId' => 'required',
            'branchId' => 'required',
            'classId' => 'required',
            'detail.*.chargeOldStudentId' => 'required',
        ];
    }
}
