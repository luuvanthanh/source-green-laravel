<?php

namespace GGPHP\Children\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ChildrenCreateRequest extends FormRequest
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
    public function rules(Request $request)
    {
        return [
            'parent_id' => 'required|exists:users,id',
            'data' => 'required|array',
            'data.*.full_name' => 'required|string',
            'data.*.birthday' => 'date|date_format:Y-m-d',
        ];
    }
}
