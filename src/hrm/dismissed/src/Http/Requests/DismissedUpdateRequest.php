<?php

namespace GGPHP\Dismissed\Http\Requests;

use GGPHP\Dismissed\Models\DismissedDetail;
use Illuminate\Foundation\Http\FormRequest;

class DismissedUpdateRequest extends FormRequest
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
            'id' => 'required',
            'data.*.employeeId' => [
                'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $dismissedDetail = DismissedDetail::where('EmployeeId', $value)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($dismissedDetail)  && $dismissedDetail->dismissed->Id != request()->id) {
                        return $fail('Quyết định không phải là mới nhất, không được phép chỉnh sửa.');
                    }
                },
            ],
        ];
    }
}
