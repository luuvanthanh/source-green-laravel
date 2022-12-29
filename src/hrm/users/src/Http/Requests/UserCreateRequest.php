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
        $type = implode(',', User::CATEGORY);
        $status = implode(',', User::STATUS);

        return [
            'code' => 'unique:Employees,Code',
            'email' => 'unique:Employees,Email',
            'fullName' => 'required|string',
            'category' => 'required|in:' . $type,
            'status' => 'required|in:' . $status,
            'typeTeacherId' => 'nullable|check_exists:evaluate_teacher.TypeTeachers,Id'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();

        if (!empty($data['status'])) {
            $data['status'] = User::STATUS[$data['status']];
        }

        if (!empty($data['category'])) {
            $data['category'] = User::CATEGORY[$data['category']];
        }

        return $data;
    }
}
