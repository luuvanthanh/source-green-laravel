<?php

namespace GGPHP\Crm\CallCenter\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateManagerCallRequest extends FormRequest
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
            'employee_id' => 'required|exists:employees,id',
            'expected_date' => 'required|date|date_format:Y-m-d',
            'content' => 'required|string',
            'list_customer_lead' => 'required|array',
            'list_customer_lead.*.customer_lead_id' => 'required|exists:customer_leads,id',
            'list_customer_lead.*.call_times' => 'required|in:FIRST,SECOND,THIRTH,FOURTH,FIVETH'
        ];
    }
}
