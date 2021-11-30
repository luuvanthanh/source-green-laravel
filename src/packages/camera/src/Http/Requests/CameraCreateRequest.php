<?php

namespace GGPHP\Camera\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use GGPHP\Camera\Models\CameraVideoProperties;

class CameraCreateRequest extends FormRequest
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
            'collection_id' => 'sometimes|array|required|exists:collections,id',
            'address' => 'required|string',
            'tourist_destination_id' => 'required|exists:tourist-destinations,id',
            'lat' => ['required', 'regex:/^[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/'],
            'long' => ['required', 'regex:/^[-]?((((1[0-7][0-9])|([0-9]?[0-9]))\.(\d+))|180(\.0+)?)$/'],
            'camera_server_id' => 'sometimes|uuid'
        ];
    }

    /**
     * Validate relation
     *
     * @param type $validator
     */
    public function withValidator($validator)
    {
        $input = $this->input();
        if (!empty($input['general'])) {
            $validator = Validator::make($input['general'], [
                'device_name' => 'string|max:70',
                // 'device_number'     => 'sometimes|integer',
                'device_model'  => 'sometimes|nullable|string',
                'serial_number' => 'sometimes|nullable|string',
                'firmware_ver'  => 'sometimes|nullable|string',
                'ip'            => 'required|string',
                'port'          => 'required|integer',
                'user_name'     => 'sometimes|nullable|string',
                'password'      => 'sometimes|nullable|string'
            ])->validate();
        }

        $inputVideo = !empty($input['video']) ? $input['video'] : [];
        $validator = Validator::make($inputVideo, [
            'resolution'        => 'required|string',
            'video_encoding'    => 'required|string',
            'frame_rate'        => 'required|integer',
            'bit_rate'          => 'required|integer',
            'recording_enabled' => 'sometimes|in:' . CameraVideoProperties::RECORDING_ENABLED . ',' . CameraVideoProperties::RECORDING_DISABLED,
            'streaming_enabled' => 'sometimes|in:' . CameraVideoProperties::STREAMING_ENABLED . ',' . CameraVideoProperties::STREAMING_DISBALED
        ])->validate();

        if (!empty($input['network'])) {
            $validator = Validator::make($input['network'], [
                'ipv4_addr'            => 'sometimes|nullable|string',
                'ipv4_subnetmask'      => 'sometimes|nullable|string',
                'ipv4_gateway'         => 'sometimes|nullable|string',
                'ipv6_addr'            => 'sometimes|nullable|string',
                'ipv6_subnetmask'      => 'sometimes|nullable|string',
                'ipv6_gateway'         => 'sometimes|nullable|string',
                'dns_server_primary'   => 'sometimes|nullable|string',
                'dns_server_secondary' => 'sometimes|nullable|string',
            ])->validate();
        }

        if (!empty($input['ptz'])) {
            $validator = Validator::make($input['ptz'], [
                'zoom_enabled' => 'required|integer',
                'pan_enabled'  => 'required|integer',
                'tilt_enabled' => 'required|integer',
                'zoom_val'     => 'required|integer',
                'pan_val'      => 'required|numeric',
                'tilt_val'     => 'required|numeric',
            ])->validate();
        }
    }
}
