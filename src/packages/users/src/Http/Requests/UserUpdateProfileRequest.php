<?php

namespace GGPHP\Users\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserUpdateProfileRequest extends FormRequest
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
        $userId = Auth::id();

        return [
            'email' => 'sometimes|email|unique:users,email,' . $userId,
            'fullname' => 'sometimes|string',
            'phone' => 'sometimes|nullable|string',
            'password' => 'sometimes|confirmed|min:8',
            'avatar' => 'sometimes|nullable|file',
            'old_password' => ['required_with:password', function ($attribute, $value, $fail) {
                if (!Hash::check($value, Auth::user()->password)) {
                    return $fail('The ' . $attribute . ' is not correct');
                }
            }]
        ];
    }
}
