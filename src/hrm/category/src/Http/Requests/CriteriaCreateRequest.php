<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\Criteria;
use Illuminate\Foundation\Http\FormRequest;

class CriteriaCreateRequest extends FormRequest
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
                    $criteria = Criteria::where('Name', $value)->first();

                    if (!is_null($criteria)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu!');
                    }
                },
            ],
            'code' => [
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $criteria = Criteria::where('Code', $value)->first();

                    if (!is_null($criteria)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu!');
                    }
                },
            ],
        ];
    }
}
