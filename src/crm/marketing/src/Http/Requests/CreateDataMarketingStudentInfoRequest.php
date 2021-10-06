<?php

namespace GGPHP\Crm\Marketing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDataMarketingStudentInfoRequest extends FormRequest
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
            'update_rows' => 'array',
            'delete_rows' => 'array',
            'create_rows.*.full_name' => 'required|string',
            'create_rows.*.birth_date' => 'date_format:Y-m-d',
            'create_rows.*.sex' => 'string',
            'create_rows.*.month_age' => 'numeric',
            //'create_rows.*.customer_lead_id' => 'required|exists:customer_leads,id',
            'update_rows.*.full_name' => 'string',
            'update_rows.*.birth_date' => 'date_format:Y-m-d',
            'update_rows.*.sex' => 'string',
            'update_rows.*.month_age' => 'numeric',
            //'update_rows.*.customer_lead_id' => 'exists:customer_leads,id',

        ];
    }
}
