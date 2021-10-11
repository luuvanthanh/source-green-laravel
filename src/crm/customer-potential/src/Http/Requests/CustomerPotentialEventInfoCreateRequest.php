<?php

namespace GGPHP\Crm\CustomerPotential\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerPotentialEventInfoCreateRequest extends FormRequest
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
            'name' => 'required|string',
            'date' => 'required|after_or_equal:today|date_format:Y-m-d H:i',
            'location' => 'required|string',
            'status' => 'required|string',
            'customer_potential_id' => 'required|exists:customer_potentials,id',
        ];
    }
}
