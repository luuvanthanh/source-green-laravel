<?php

namespace GGPHP\Crm\CustomerLead\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HistoryCareUpdateRequest extends FormRequest
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
            'create_rows' => 'array',
            'create_rows.*.customer_lead_id' => 'nullable|exists:customer_leads,id',
        ];
    }
}
