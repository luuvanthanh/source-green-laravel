<?php

namespace GGPHP\Collection\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CollectionUpdateRequest extends FormRequest
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
            'name'               => 'sometimes|required|string',
            'type'               => 'sometimes|string',
            'location'           => 'sometimes|string',
            'cameras'            => 'sometimes|array',
            'cameras.*.id'       => 'required|exists:cameras,id',
            'cameras.*.priority' => 'required|integer',
            'users'              => 'sometimes|array',
            'users.*.id'         => 'required|exists:users,id',
            'users.*.permission' => 'array'
        ];
    }
}
