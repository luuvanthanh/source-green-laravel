<?php

namespace GGPHP\FingerprintTimekeeper\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FingerprintTimekeeperCreateRequest extends FormRequest
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
            'name' => 'required|string',
            'store_id' => 'required',
            'ip' => 'required|string',
            'port' => 'required|numeric',
            'serial_number' => 'required|string',
        ];
    }
}
