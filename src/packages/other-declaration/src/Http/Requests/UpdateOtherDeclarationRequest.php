<?php

namespace GGPHP\OtherDeclaration\Http\Requests;

use GGPHP\OtherDeclaration\Models\OtherDeclaration;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOtherDeclarationRequest extends FormRequest
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
            'time' => [
                function ($attribute, $value, $fail) {
                    $otherDeclaration = OtherDeclaration::where('Id', '!=', $this->route('id'))->where('Time', $value)->first();

                    if (!is_null($otherDeclaration)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu');
                    }
                },
            ],
        ];
    }
}
