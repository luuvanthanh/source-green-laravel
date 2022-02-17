<?php

namespace GGPHP\Crm\CustomerPotential\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCustomerPotentialRequest extends FormRequest
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
            'full_name' => 'required|string',
            'birth_date' => 'date_format:Y-m-d',
            'email' => 'email',
            'phone' => 'required|string',
            'city_id' => 'exists:citys,id',
            'district_id' => 'exists:districts,id',
            'town_ward_id' => 'exists:town_wards,id'
        ];
    }
}
