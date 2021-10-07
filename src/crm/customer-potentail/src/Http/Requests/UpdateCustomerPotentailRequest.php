<?php

namespace GGPHP\Crm\CustomerPotentail\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerPotentailRequest extends FormRequest
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
            'full_name' => 'string',
            'birth_date' => 'date_format:Y-m-d',
            'sex' => 'string',
            'email' => 'email',
            'address' => 'string',
            'city_id' => 'exists:citys,id',
            'district_id' => 'exists:districts,id'
        ];
    }
}
