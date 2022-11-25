<?php

namespace GGPHP\ActivityLog\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActivityLogCreateRequest extends FormRequest
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
            'name' => 'required|unique:ActivityLoges,Name',
            'code' => 'required|unique:ActivityLoges,Code',
        ];
    }
}
