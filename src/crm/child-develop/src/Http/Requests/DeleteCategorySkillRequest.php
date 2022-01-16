<?php

namespace GGPHP\Crm\ChildDevelop\Http\Requests;

use GGPHP\Crm\ChildDevelop\Models\ChildEvaluate;
use Illuminate\Foundation\Http\FormRequest;

class DeleteCategorySkillRequest extends FormRequest
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $checkId = $this->checkAccessDelete($value);

                    if ($checkId) {
                        return true;
                    }
                    return $fail('Dữ liệu đang được sử dụng');
                },
            ],
        ];
    }

    private function checkAccessDelete($id)
    {
        $childEvaluate = ChildEvaluate::where('category_skill_id', $id)->first();

        if (is_null($childEvaluate)) {
            return true;
        }

        return false;
    }
}
