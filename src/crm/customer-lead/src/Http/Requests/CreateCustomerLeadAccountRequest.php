<?php

namespace GGPHP\Crm\CustomerLead\Http\Requests;

use GGPHP\Crm\SsoAccount\Models\SsoAccount;
use Illuminate\Foundation\Http\FormRequest;

class CreateCustomerLeadAccountRequest extends FormRequest
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
            'user_name' => 'unique:sso_accounts,user_name',
            'email' => 'unique:sso_accounts,email',
        ];
    }

    public function messages()
    {
        return [
            'user_name.unique' => 'Tên tài khoản đã tồn tại trong hệ thống',
            'email.unique' => 'Email đã tồn tại trong hệ thống',
        ];
    }
}
