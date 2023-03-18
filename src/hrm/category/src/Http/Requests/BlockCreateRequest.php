<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\Block;
use Illuminate\Foundation\Http\FormRequest;

class BlockCreateRequest extends FormRequest
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
            'name' => [
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $block = Block::where('Name', $value)->first();

                    if (!is_null($block)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu!');
                    }
                },
            ],
            'code' => [
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $block = Block::where('Code', $value)->first();

                    if (!is_null($block)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu!');
                    }
                },
            ],
            'note' => 'nullable|max:255',
            'projects' => 'array|nullable',
            'projects.*' => 'required|check_exists:distribution.ClassProjects,Id',
            'classes' => 'array|nullable',
            'classes.*.name' => 'required|string'
        ];
    }
}
