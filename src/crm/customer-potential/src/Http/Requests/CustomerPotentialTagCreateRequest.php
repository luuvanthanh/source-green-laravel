<?php

namespace GGPHP\Crm\CustomerPotential\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerPotentialTagCreateRequest extends FormRequest
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
            'customer_tag' => 'array',
            'customer_tag.*.tag_id' => 'required|exists:tags,id',
            'customer_potential_id' => 'required|exists:customer_potentials,id',
        ];
    }
}
