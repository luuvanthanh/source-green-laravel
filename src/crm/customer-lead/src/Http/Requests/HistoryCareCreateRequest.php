<?php

namespace GGPHP\Crm\CustomerLead\Http\Requests;

use GGPHP\Crm\CustomerLead\Models\HistoryCare;
use Illuminate\Foundation\Http\FormRequest;

class HistoryCareCreateRequest extends FormRequest
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
        $status = implode(',', array_keys(HistoryCare::STATUS));
        $category = implode(',', array_keys(HistoryCare::CATEGORY));

        return [
            'create_rows' => 'array',
            'create_rows.*.customer_lead_id' => 'required|exists:customer_leads,id',
            'create_rows.*.status' => 'required|in:' . $status,
            'create_rows.*.category' => 'required|in:' . $category,
        ];
    }
}
