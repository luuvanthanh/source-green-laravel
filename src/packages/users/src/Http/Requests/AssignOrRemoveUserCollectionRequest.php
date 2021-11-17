<?php

namespace GGPHP\Users\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignOrRemoveUserCollectionRequest extends FormRequest
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
            'collection_id' => 'required|int|exists:collections,id',
            'users' => 'required|array',
            'users.*.user_id' => 'required|exists:users,id',
            'users.*.permission' => 'required|array',
            'users.*.permission.*' => 'exists:permissions,id',
            'users_delete' => 'array',
        ];
    }

}
