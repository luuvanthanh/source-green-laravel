<?php

namespace GGPHP\Crm\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuestionReviewCreateRequest extends FormRequest
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
            'create_rows' => 'array',
            'update_rows' => 'array',
            'delete_rows' => 'array',
            'create_rows.*.question' => 'required|string',
            'update_rows.*.question' => 'string',
        ];
    }
}
