<?php

namespace GGPHP\ChildDevelop\Category\Http\Requests;

use GGPHP\ChildDevelop\Category\Models\CategoryChildIssue;
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
            'Id' => 'required',
            'Name' => [
                function ($attribute, $value, $fail) {
                    $categoryChildIssue = CategoryChildIssue::where('Name', $value)->where('Id', '!=', $this->id)->first();

                    if (is_null($categoryChildIssue)) {
                        return true;
                    }

                    return $fail('Dữ liệu đã có trong hệ thống');
                },
            ],
        ];
    }
}
