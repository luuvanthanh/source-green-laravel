<?php

namespace GGPHP\Profile\Http\Requests;

use Carbon\Carbon;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

class ProbationaryContractCreateRequest extends FormRequest
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
            'employeeId' => [
                'required',
                'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->where('IsEffect', true)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($labourContract)) {
                        return $fail('Đã có hợp đồng lao động, không được tạo hợp đồng thử việc.');
                    }
                },
            ],
            'contractNumber' => 'required|string|unique:ProbationaryContracts,ContractNumber',
            'contractDate' => [
                'required', 'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->where('IsEffect', true)->orderBy('CreationTime', 'DESC')->first();
                    $value = Carbon::parse($value)->setTimezone('GMT+7')->format('Y-m-d');

                    if (is_null($probationaryContract->ContractDate)) {
                        return $fail('Chưa hoàn tất hợp đồng đã tạo trước đó');
                    }

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractDate->format('Y-m-d')) {
                        return $fail('Ngày hợp đồng phải lớn hơn ngày hợp đồng gần nhất ' . $probationaryContract->ContractDate->format('d-m-Y'));
                    }
                },
            ],
            'typeOfContractId' => 'required|exists:TypeOfContracts,Id',
            // 'salaryRatio' => 'required',
            'month' => 'required',
            'divisionId' => 'required|exists:Divisions,Id',
            'contractFrom' => [
                'required', 'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;

                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->where('IsEffect', true)->orderBy('ContractDate', 'DESC')->first();
                    $value = Carbon::parse($value)->setTimezone('GMT+7')->format('Y-m-d');

                    if (is_null($probationaryContract->ContractTo)) {
                        return $fail('Chưa hoàn tất hợp đồng đã tạo trước đó');
                    }

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractTo->format('Y-m-d')) {
                        return $fail('Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng thử việc gần nhất ' . $probationaryContract->ContractTo->format('d-m-Y'));
                    }
                },
            ],
            'contractTo' => 'required|date',
            'positionId' => 'required|exists:Positions,Id',
            'work' => 'required|string',
            'workTime' => 'required|string',
            'branchId' => 'required|exists:Branches,Id',
        ];
    }
}
