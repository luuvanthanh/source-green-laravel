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
            'birth_date' => 'required|date_format:Y-m-d',
            'sex' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required',
            'address' => 'required|string',
            'city_id' => 'required|exists:citys,id',
            'district_id' => 'required|exists:districts,id',
            'search_source_id'=> 'required|exists:search_sources,id'
        ];
    }
}
