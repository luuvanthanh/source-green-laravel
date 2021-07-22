<?php

namespace GGPHP\BusRegistration\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBusRegistrationRequest extends FormRequest
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
            'hourNumber' => [
                function ($attribute, $value, $fail) {

                    if ($value < 0) {
                        return $fail("Trường dữ liệu phải lớn hơn 0.");
                    }
                },
            ],
        ];
    }
}
