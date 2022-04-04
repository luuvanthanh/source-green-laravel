<?php

namespace GGPHP\Fee\Http\Requests;

use GGPHP\Fee\Models\Fee;
use Illuminate\Foundation\Http\FormRequest;

class CreateFeeRequest extends FormRequest
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
            'code' => function ($attribute, $value, $fail) {
                $fee = Fee::where('Code', $value)->first();

                if (!is_null($fee)) {
                    return $fail('Mã phí đã có trong cơ sở dữ liệu.');
                }
            }
        ];
    }
}
