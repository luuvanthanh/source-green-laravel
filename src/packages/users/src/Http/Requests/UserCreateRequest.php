<?php

namespace GGPHP\Users\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserCreateRequest extends FormRequest
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
            'email' => 'required|email|unique:users,email',
            'full_name' => 'required|string',
            'phone' => 'sometimes|string',
            'role_id' => 'sometimes|exists:roles,id',
            'permission_id' => 'sometimes|array|exists:permissions,id',
        ];
    }
}
