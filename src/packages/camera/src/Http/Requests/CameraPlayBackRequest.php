<?php

namespace GGPHP\Camera\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CameraPlayBackRequest extends FormRequest
{
    /**
     * Determine if the camera is authorized to make this request.
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
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'end_time'   => 'required|date_format:Y-m-d H:i:s',
        ];
    }
}
