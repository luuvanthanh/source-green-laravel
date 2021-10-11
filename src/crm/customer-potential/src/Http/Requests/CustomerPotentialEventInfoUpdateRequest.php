<?php

namespace GGPHP\Crm\CustomerPotential\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerPotentialEventInfoUpdateRequest extends FormRequest
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
            'name' => 'string',
            'date' => 'date_format:Y-m-d H:i',
            'location' => 'string',
            'status' => 'string',
            'customer_potential_id' => 'exists:customer_potentials,id',
        ];
    }
}
