<?php

namespace GGPHP\Crm\CustomerPotential\Http\Requests;

use GGPHP\Product\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class CustomerPotentialEventInfoDeleteRequest extends FormRequest
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
        return [];
    }
}
