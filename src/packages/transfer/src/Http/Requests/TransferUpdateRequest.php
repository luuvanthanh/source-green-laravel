<?php

namespace GGPHP\Transfer\Http\Requests;

use GGPHP\Transfer\Models\Transfer;
use GGPHP\Transfer\Models\TransferDetail;
use Illuminate\Foundation\Http\FormRequest;

class TransferUpdateRequest extends FormRequest
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
                    $transferDetail = TransferDetail::where('EmployeeId', $value)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($transferDetail)  && $transferDetail->transfer->Id != request()->id) {
                        return $fail('Quyết định không phải là mới nhất, không được phép chỉnh sửa.');
                    }
                },
            ],
        ];
    }
}
