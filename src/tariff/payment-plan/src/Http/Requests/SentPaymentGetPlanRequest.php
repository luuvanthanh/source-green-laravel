<?php

namespace GGPHP\Tariff\PaymentPlan\Http\Requests;

use GGPHP\Tariff\PaymentPlan\Models\PaymentPlan;
use Illuminate\Foundation\Http\FormRequest;

class SentPaymentGetPlanRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $status = implode(',', array_values(PaymentPlan::STATUS));
        
        return [
            'status' => 'in:' . $status
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();
        if (isset($data['status'])) {
            $data['status'] = array_key_exists($data['status'], PaymentPlan::STATUS) ? PaymentPlan::STATUS[$data['status']] : 0;
        }

        return $data;
    }
}
