<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\Block;
use GGPHP\Clover\Models\Item;
use Illuminate\Foundation\Http\FormRequest;

class BlockUpdateRequest extends FormRequest
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
                'string', 'max:255',
                function ($attribute, $value, $fail) {
                    $branch = Block::where('Name', $value)->where('Id', '!=', $this->route('block'))->first();

                    if (!is_null($branch)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string', 'max:255',
                function ($attribute, $value, $fail) {
                    $branch = Block::where('Code', $value)->where('Id', '!=', $this->route('block'))->first();

                    if (!is_null($branch)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'note' => 'nullable|max:255',
            'classes' => 'array|nullable',
            'classes.*.name' => 'required|string',
            'programs' => 'array|nullable',
            'programs.id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $program = Item::where('Id', $value)->where('Type', 'PROGRAM')->first();

                    if (is_null($program)) {
                        return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                    }
                },
            ],
            'programs.modules' => 'array|nullable',
            'programs.modules.*.id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $module = Item::where('Id', $value)->where('Type', 'MODULE')->first();

                    if (is_null($module)) {
                        return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                    }
                },
            ],
            'programs.modules.*.projects' => 'array|nullable',
            'programs.modules.*.projects.*' => [
                'required',
                function ($attribute, $value, $fail) {
                    $project = Item::where('Id', $value)->where('Type', 'PROJECT')->first();

                    if (is_null($project)) {
                        return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                    }
                },
            ]
        ];
    }
}
