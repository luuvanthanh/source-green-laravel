<?php

namespace GGPHP\RolePermission\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleAssignPermissionRequest extends FormRequest
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
            'data_new' => 'sometimes|array',
            'data_delete' => 'sometimes|array',
            'data_new.*.role_id' => 'exists:roles,id',
            'data_delete.*.role_id' => 'exists:roles,id',
            'data_new.*.permission_id' => 'exists:permissions,id',
            'data_delete.*.permission_id' => 'exists:permissions,id',
        ];
    }
}
