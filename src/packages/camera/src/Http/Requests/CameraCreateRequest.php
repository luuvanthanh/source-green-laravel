<?php

namespace GGPHP\Camera\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'name' => 'required|string',
            'address' => 'required|string',
            'lat' => ['sometimes', 'regex:/^[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/'],
            'long' => ['sometimes', 'regex:/^[-]?((((1[0-7][0-9])|([0-9]?[0-9]))\.(\d+))|180(\.0+)?)$/'],
            'ip'            => 'required|string',
            'port'          => 'required|string',
            'tourist_destination_id' => 'required|exists:tourist_destinations,id',
            'camera_server_id' => 'sometimes|uuid'
        ];
    }
}
