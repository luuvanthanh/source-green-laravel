<?php

namespace GGPHP\Crm\CallCenter\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEndCallRequest extends FormRequest
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
            'status_lead' => 'nullable|in:LEAD_NEW,POTENTIAL,NOT_POTENTIAL',
            'status_parent_lead_id' => 'nullable|exists:status_parent_leads,id',
            'customer_lead_id' => 'nullable|exists:history_calls,customer_lead_id',
            'status_parent_potential_id' => 'nullable|exists:status_parent_potentials,id'
        ];
    }
}
