<?php

namespace GGPHP\Appoint\Http\Requests;

use GGPHP\Appoint\Models\AppointDetail;
use Illuminate\Foundation\Http\FormRequest;

class AppointUpdateRequest extends FormRequest
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
                    $appointDetail = AppointDetail::where('EmployeeId', $value)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($appointDetail)  && $appointDetail->appoint->Id != request()->id) {
                        return $fail("Quyết định không phải là mới nhất, không được phép chỉnh sửa.");
                    }
                },
            ],
        ];
    }
}
