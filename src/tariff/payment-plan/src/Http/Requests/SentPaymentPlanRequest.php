<?php

namespace GGPHP\Tariff\PaymentPlan\Http\Requests;

use GGPHP\Tariff\PaymentPlan\Models\PaymentPlan;
use Illuminate\Foundation\Http\FormRequest;

class SentPaymentPlanRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => 'required:exists:PaymentPlans,Id',
            'status' => 'required|in:' . PaymentPlan::STATUS['SENT']
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();

        $data['status'] = array_key_exists($data['status'], PaymentPlan::STATUS) ? PaymentPlan::STATUS[$data['status']] : 0;

        return $data;
    }
}
