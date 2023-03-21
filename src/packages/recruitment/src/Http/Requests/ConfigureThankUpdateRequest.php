<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\ConfigureThank;
use GGPHP\Recruitment\Models\Level;
use Illuminate\Foundation\Http\FormRequest;

class ConfigureThankUpdateRequest extends FormRequest
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
            'content' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    $configureThank = ConfigureThank::where('Content', $value)->where('Id' , '!=', $this->id)->first();

                    if (!is_null($configureThank)) {

                        return $fail('Dữ liệu đã có trong hệ thống');
                    }
                },
            ],
        ];
    }
}
