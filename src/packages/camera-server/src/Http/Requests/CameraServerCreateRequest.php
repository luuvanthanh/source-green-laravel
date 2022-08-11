<?php

namespace GGPHP\CameraServer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CameraServerCreateRequest extends FormRequest
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
            'ipv4'       => 'sometimes|string',
            'nas_folder' => 'sometimes|string',
            'ipv6'       => 'sometimes|string',
        ];
    }
}
