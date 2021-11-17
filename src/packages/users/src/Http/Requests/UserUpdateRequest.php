<?php

namespace GGPHP\Users\Http\Requests;

use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $id = $this->route('id');
        $user = \Auth::user();

        return app(Gate::class)->allows('update', $user);
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $status = implode(',', config('constants.STATUS'));

        return [
            'email' => 'sometimes|email|unique:users,email,' . $this->route('user'),
            'fullname' => 'sometimes|string',
            'phone' => 'sometimes|nullable|string',
            'status' => 'sometimes|integer|in:' . $status,
            'password' => 'sometimes|confirmed|min:8',
        ];
    }
}
