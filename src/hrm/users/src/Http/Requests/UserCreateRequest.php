<?php

namespace GGPHP\Users\Http\Requests;

use GGPHP\Users\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UserCreateRequest extends FormRequest
{
    /**
     * Determine if the employee is authorized to make this request.
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
        $type = implode(',', array_keys(User::CATEGORY));

        return [
            'code' => 'unique:Employees,Code',
            'email' => 'unique:Employees,Email',
            'fullName' => 'required|string',
            'category' => 'required|in:' . $type
        ];
    }
}
