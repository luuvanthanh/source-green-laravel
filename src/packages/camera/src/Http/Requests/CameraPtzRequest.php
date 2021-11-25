<?php

namespace GGPHP\Camera\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use GGPHP\Camera\Models\CameraVideoProperties;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class CameraPtzRequest extends FormRequest
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
        $action = config('constants.CAMERA.PTZ.ACTION', []);
        $status = config('constants.CAMERA.PTZ.STATUS', []);

        return [
            'action' => 'required|in:' . implode(',', $action),
            'status' => 'required|in:' . implode(',', $status),
        ];
    }
}
