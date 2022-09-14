<?php

namespace GGPHP\RolePermission\Http\Requests;

use GGPHP\RolePermission\Models\Role;
use Illuminate\Foundation\Http\FormRequest;

class RoleDeleteRequest extends FormRequest
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $role = Role::findOrFail($value);

                    if (!$role->users->isEmpty()) {
                        return $fail('Dữ liệu đã được sử dụng');
                    }
                },
            ],
        ];
    }
}
