<?php

namespace GGPHP\Crm\Category\Http\Requests;

use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\Marketing\Models\DataMarketing;
use Illuminate\Foundation\Http\FormRequest;

class SearchSourceDeleteRequest extends FormRequest
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $customerLead = CustomerLead::where('search_source_id', $this->search_source)->where('deleted_at', null)->first();
                    $dataMarketing = DataMarketing::where('search_source_id', $this->search_source)->where('deleted_at', null)->first();

                    if (!is_null($customerLead) || !is_null($dataMarketing)) {
                        return $fail('Dữ liệu đang được sử dụng');
                    }

                    return true;
                },
            ]
        ];
    }
}
