<?php

namespace GGPHP\Crm\CustomerLead\Http\Requests;

use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use Illuminate\Foundation\Http\FormRequest;

class MoveCustomerLeadRequest extends FormRequest
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $customerPotential = CustomerPotential::where('customer_lead_id', $value)->first();

                    if (!is_null($customerPotential)) {
                        return $fail('Một phụ huynh chỉ được chuyển tiềm năng một lần');
                    } else {
                        $customerLead = CustomerLead::find($value);
                        
                        if (is_null($customerLead->email) && (is_null($customerLead->phone) || is_null($customerLead->orther_phone))) {
                            return $fail('Thông tin Email và Số điện thoại không được trống');
                        } else {
                            return true;
                        }
                    }
                },
            ],

            'statusPotential' => 'required:status_parent_potentials,id',
        ];
    }
}
