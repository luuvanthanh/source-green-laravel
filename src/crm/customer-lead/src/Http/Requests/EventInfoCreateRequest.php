<?php

namespace GGPHP\Crm\CustomerLead\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventInfoCreateRequest extends FormRequest
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
            'date' => 'required|after_or_equal:today|date_format:Y-m-d',
            'location' => 'required|string',
            'customer_lead_id' => 'required|exists:customer_leads,id',
            'category_event_id' => 'required|exists:category_events,id'
        ];
    }
}
