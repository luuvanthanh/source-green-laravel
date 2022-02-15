<?php

namespace GGPHP\Fingerprint\Http\Requests;

use GGPHP\Fingerprint\Models\Fingerprint;
use Illuminate\Foundation\Http\FormRequest;

class FingerprintUpdateRequest extends FormRequest
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
            'status' => 'sometimes|string|in:' . implode(',', [Fingerprint::ON, Fingerprint::OFF]),
        ];
    }
}
