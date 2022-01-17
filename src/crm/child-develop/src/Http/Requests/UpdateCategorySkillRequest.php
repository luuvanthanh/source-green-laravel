<?php

namespace GGPHP\Crm\ChildDevelop\Http\Requests;

use GGPHP\Crm\ChildDevelop\Models\CategorySkill;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCategorySkillRequest extends FormRequest
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
                    $categorySkill = CategorySkill::where('name', $value)->where('id', '!=', $this->id)->first();

                    if (is_null($categorySkill)) {
                        return true;
                    }

                    return $fail('Dữ liệu đã có trong hệ thống');
                },
            ],
        ];
    }
}
