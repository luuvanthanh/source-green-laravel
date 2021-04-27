<?php

namespace GGPHP\FingerprintTimekeeper\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FingerprintTimekeeperCreateRequest extends FormRequest
{
    /**
     * Determine if the employee is authorized to make this request.
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
            'ip' => 'required|string',
            'port' => 'required|numeric',
            'serialNumber' => 'required|string',
        ];
    }
}
