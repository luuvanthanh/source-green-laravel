<?php

namespace GGPHP\Fee\Http\Requests;

use GGPHP\Fee\Models\FeePolicie;
use Illuminate\Foundation\Http\FormRequest;

class CreateFeePolicieRequest extends FormRequest
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
            'SchoolYearId' => [
                'required',
                function ($attribute, $value, $fail) {
                    $feePolicie = FeePolicie::where('SchoolYearId', $value)->first();

                    if (!is_null($feePolicie)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
