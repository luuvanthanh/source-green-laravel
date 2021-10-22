<?php

namespace GGPHP\Dismissed\Http\Requests;

use Carbon\Carbon;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

class DismissedCreateRequest extends FormRequest
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
            'decisionNumber' => 'unique:Dismisseds,DecisionNumber',
            'decisionDate' => 'required|after_or_equal:today',
            'timeApply' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $value = Carbon::parse($value)->format('Y-m-d');
                    $data = request()->data;

                    $tranfer = \GGPHP\PositionLevel\Models\PositionLevel::where('EmployeeId', $data[0]['employeeId'])->where('StartDate', '>=', $value)->first();

                    if (!is_null($tranfer)) {
                        $startDate = $tranfer->StartDate->format('d-m-Y');
                        return $fail("Thời gian áp dụng phải lớn hơn ngày $startDate.");
                    }
                },
            ],
            'data' => 'required|array',
            'data.*.employeeId' => [
                'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();

                    if (is_null($labourContract)  && is_null($probationaryContract)) {
                        return $fail("Chưa có hợp đồng không được tạo quyết định.");
                    }
                },
            ],
            'data.*.branchId' => 'required',
            'data.*.divisionId' => 'required',
            'data.*.positionId' => 'required',
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'decisionDate.after_or_equal' => "Trường phải là một ngày sau ngày hiện tại.",
        ];
    }
}
