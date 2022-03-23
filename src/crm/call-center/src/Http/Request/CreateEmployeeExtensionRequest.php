<?php

namespace GGPHP\Crm\CallCenter\Http\Requests;

use GGPHP\Crm\CallCenter\Models\EmployeeExtension;
use Illuminate\Foundation\Http\FormRequest;

class CreateEmployeeExtensionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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
            'extension_id' => 'required|exists:extensions,id',
            'employee_id.*' => [
                'required',
                'exists:employees,id',
                'distinct',
                function ($attribute, $value, $fail) {
                    $check = EmployeeExtension::where('employee_id', $value)
                        ->where('extension_id', '!=', $this->extension_id)->first();

                    if (!is_null($check)) {
                        return $fail('Nhân sự :attribute đã tồn tại trong một nhánh khác');
                    }
                    
                    return true;
                }
            ]
        ];
    }
}
