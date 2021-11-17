<?php

namespace GGPHP\Users\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserCollectionRequest extends FormRequest
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
            'users_id' => 'required|exists:users,id',
            'collection_id' => 'required|exists:collections,id',
            'role_id' => 'required|exists:roles,id',
        ];
    }
}
