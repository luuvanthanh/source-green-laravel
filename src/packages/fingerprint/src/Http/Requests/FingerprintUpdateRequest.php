<?php

namespace GGPHP\Fingerprint\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use GGPHP\Fingerprint\Models\Fingerprint;

class FingerprintUpdateRequest extends FormRequest
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
            'status' => "sometimes|string|in:" . implode(',', [Fingerprint::ON, Fingerprint::OFF]),
        ];
    }
}
