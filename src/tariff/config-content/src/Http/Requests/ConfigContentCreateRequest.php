<?php

namespace GGPHP\Tariff\ConfigContent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConfigContentCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            'paymentTime' => 'required|integer',
            'detail' => 'array',
            'detail.*.formName' => 'required|string'
        ];
    }
}
