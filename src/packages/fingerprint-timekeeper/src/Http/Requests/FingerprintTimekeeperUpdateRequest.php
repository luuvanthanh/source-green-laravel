<?php

namespace GGPHP\FingerprintTimekeeper\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FingerprintTimekeeperUpdateRequest extends FormRequest
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
            'name' => 'string',
            'ip' => 'string',
            'port' => 'numeric',
            'serial_number' => 'string',
        ];
    }
}
