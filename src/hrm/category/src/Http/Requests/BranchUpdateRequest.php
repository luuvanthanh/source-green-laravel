<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\City;
use Illuminate\Foundation\Http\FormRequest;

class BranchUpdateRequest extends FormRequest
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
                    $branch = Branch::where('Name', $value)->where('Id', '!=', $this->route('branch'))->first();

                    if (!is_null($branch)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string', 'max:255',
                function ($attribute, $value, $fail) {
                    $branch = Branch::where('Code', $value)->where('Id', '!=', $this->route('branch'))->first();

                    if (!is_null($branch)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'note' => 'nullable|max:255',
            'cityId' => 'required|exists:Citys,Id'
        ];
    }
}
