<?php

namespace GGPHP\Transfer\Http\Requests;

use Carbon\Carbon;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

class TransferCreateRequest extends FormRequest
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
            'decisionNumber' => 'required|unique:Transfers,DecisionNumber',
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
            'data' => [
                'required',
                'array',
                function ($attribute, $value, $fail) {
                    $positionLevel = \GGPHP\PositionLevel\Models\PositionLevel::where('EmployeeId', $value[0]['employeeId'])->where('BranchId', $value[0]['branchId'])->where('DivisionId', $value[0]['divisionId'])->where('PositionId', $value[0]['positionId'])->first();

                    if (is_null($positionLevel)) {
                        return true;
                    }

                    return $fail('Dữ liệu cơ sở mới, bộ phận mới, chức vụ mới đã có trong hệ thống ! vui lòng thay đổi 1 hoặc 2 trong 3 dữ liệu ');
                }
            ],
            'data.*.employeeId' => [
                'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();

                    if (is_null($labourContract)  && is_null($probationaryContract)) {
                        return $fail("Chưa có hợp đồng không được tạo điều chuyển.");
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
            'decisionDate.after_or_equal' => "Trường phải là ngày hiện tại hoặc sau ngày hiện tại.",
        ];
    }
}
