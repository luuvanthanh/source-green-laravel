<?php

namespace GGPHP\Crm\Marketing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDataMarketingRequest extends FormRequest
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
            'birth_date' => 'nullable|date_format:Y-m-d',
            'sex' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'required',
            'address' => 'nullable|string',
            'city_id' => 'nullable|exists:citys,id',
            'district_id' => 'nullable|exists:districts,id',
            'search_source_id' => 'nullable|exists:search_sources,id',
            'branch_id' => 'nullable|exists:branches,id'
        ];
    }
}
