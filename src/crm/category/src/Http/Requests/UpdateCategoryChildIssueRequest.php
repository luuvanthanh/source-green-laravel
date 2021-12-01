<?php

namespace GGPHP\Crm\Category\Http\Requests;

use GGPHP\Crm\Category\Models\CategoryChildIssue;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryChildIssueRequest extends FormRequest
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
            'id' => 'required',
            'name' => [
                function ($attribute, $value, $fail) {
                    $categoryChildIssue = CategoryChildIssue::where('name', $value)->where('id', '!=', $this->id)->first();

                    if (is_null($categoryChildIssue)) {
                        return true;
                    }

                    return $fail('Dữ liệu đã có trong hệ thống');
                },
            ],
        ];
    }
}
