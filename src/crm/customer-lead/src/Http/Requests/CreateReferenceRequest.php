<?php

namespace GGPHP\Crm\CustomerLead\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateReferenceRequest extends FormRequest
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
            'phone' => 'required',
            'address' => 'string',
            'status_parent_lead_id' => 'nullable|exists:status_parent_leads,id',
            'customer_lead_id' => 'required|exists:customer_leads,id'
        ];
    }
}
