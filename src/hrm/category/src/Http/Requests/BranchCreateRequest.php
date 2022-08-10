<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\City;
use Illuminate\Foundation\Http\FormRequest;

class BranchCreateRequest extends FormRequest
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
                    $branch = Branch::where('Name', $value)->first();

                    if (!is_null($branch)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu!');
                    }
                },
            ],
            'code' => [
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $branch = Branch::where('Code', $value)->first();

                    if (!is_null($branch)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu!');
                    }
                },
            ],
            'note' => 'nullable|max:255',
            'cityId' => 'required|exists:Citys,Id'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        if (!empty($data['cityId'])) {
            $city = City::find($data['cityId']);
            $data['code'] = $city->code . $data['code'];
        }

        return $data;
    }
}
