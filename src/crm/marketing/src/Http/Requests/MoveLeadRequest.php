<?php

namespace GGPHP\Crm\Marketing\Http\Requests;

use GGPHP\Crm\Marketing\Models\DataMarketing;
use Illuminate\Foundation\Http\FormRequest;

class MoveLeadRequest extends FormRequest
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
            'data_marketing_id' => [
                'array',
                function ($attribute, $value, $fail) {
                    $dataMarketing = DataMarketing::whereIn('email', function ($query) use ($value) {
                        $query->select('email')->from('data_marketings')->whereIn('id', $value)->get();
                    })->whereIn('phone', function ($query) use ($value) {
                        $query->select('phone')->from('data_marketings')->whereIn('id', $value)->get();
                    })->where('deleted_at','!=',null)->first();

                    if (!is_null($dataMarketing)) {
                        return $fail('Dữ liệu bị trùng số điện thoại hoặc email, vui lòng kiểm tra lại trước khi chuyển sang lead');
                    }

                    return;
                }
            ],
        ];
    }
}
