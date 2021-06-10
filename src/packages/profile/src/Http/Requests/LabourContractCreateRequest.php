<?php

namespace GGPHP\Profile\Http\Requests;

use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

class LabourContractCreateRequest extends FormRequest
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
            'employeeId' => 'required|exists:Employees,Id',
            'contractNumber' => 'required|string|unique:LabourContracts,ContractNumber',
            'contractDate' => [
                'required', 'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($labourContract) && $value <= $labourContract->ContractTo->format('Y-m-d')) {
                        return $fail("Ngày hợp đồng phải lớn hơn ngày hết hiệu lực hợp đồng gần nhất " . $labourContract->ContractDate->format('d-m-Y'));
                    }

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractTo->format('Y-m-d')) {
                        return $fail("Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng gần nhất " . $probationaryContract->ContractTo->format('d-m-Y'));
                    }
                },
            ],
            'typeOfContractId' => 'required|exists:TypeOfContracts,Id',
            'year' => 'required',
            'month' => 'required',
            'divisionId' => 'required|exists:Divisions,Id',
            'contractFrom' => ['required', 'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($labourContract) && $value <= $labourContract->ContractTo->format('Y-m-d')) {
                        return $fail("Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng gần nhất " . $labourContract->ContractTo->format('d-m-Y'));
                    }

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractTo->format('Y-m-d')) {
                        return $fail("Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng gần nhất " . $probationaryContract->ContractTo->format('d-m-Y'));
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
