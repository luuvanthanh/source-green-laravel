<?php

namespace GGPHP\Users\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
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
        return [
            'code' => function ($attribute, $value, $fail) {
                $user = User::where('Code', $value)->where('Id', '!=', $this->id)->first();

                if (!is_null($user)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            },
        ];
    }
}
