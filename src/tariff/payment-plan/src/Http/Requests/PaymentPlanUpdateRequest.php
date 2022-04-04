<?php

namespace GGPHP\Tariff\PaymentPlan\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentPlanUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [];
    }
}
