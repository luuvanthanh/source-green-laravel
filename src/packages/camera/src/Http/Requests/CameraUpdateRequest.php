<?php

namespace GGPHP\Camera\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use GGPHP\Camera\Models\CameraVideoProperties;

class CameraUpdateRequest extends FormRequest
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
            'collection_id'    => 'sometimes|array|exists:collections,id',
            'camera_server_id' => 'sometimes'
        ];
    }

    public function withValidator($validator)
    {
        $input = $this->input();

        if (!empty($input['video'])) {
            Validator::make($input['video'], [
                'resolution'        => 'sometimes|string',
                'video_encoding'    => 'sometimes|string',
                'frame_rate'        => 'sometimes|integer',
                'bit_rate'          => 'sometimes|integer',
                'stream_url'        => 'sometimes|nullable|string',
                'recording_enabled' => 'sometimes|in:' . CameraVideoProperties::RECORDING_ENABLED . ',' . CameraVideoProperties::RECORDING_DISABLED,
                'streaming_enabled' => 'sometimes|in:' . CameraVideoProperties::STREAMING_ENABLED . ',' . CameraVideoProperties::STREAMING_DISBALED
            ])->validate();
        }

        if (!empty($input['ptz'])) {
            Validator::make($input['ptz'], [
                'zoom_enabled'      => 'required|integer',
                'pan_enabled'       => 'required|integer',
                'tilt_enabled'      => 'required|integer',
                'zoom_val'          => 'required|integer',
                'pan_val'           => 'required|numeric',
                'tilt_val'          => 'required|numeric',
            ])->validate();
        }
    }
}
