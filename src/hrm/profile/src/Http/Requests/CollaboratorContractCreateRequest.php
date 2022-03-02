<?php

namespace GGPHP\Profile\Http\Requests;

use Carbon\Carbon;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

class CollaboratorContractCreateRequest extends FormRequest
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
            'contractNumber' => 'required|string|unique:CollaboratorContracts,ContractNumber',
            // 'contractDate' => [
            //     'required', 'date',
            //     function ($attribute, $value, $fail) {
            //         $employeeId = request()->employeeId;
            //         $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->where('IsEffect', true)->orderBy('CreationTime', 'DESC')->first();
            //         $labourContract = LabourContract::where('EmployeeId', $employeeId)->where('IsEffect', true)->orderBy('CreationTime', 'DESC')->first();
            //         $value = Carbon::parse($value)->setTimezone('GMT+7')->format('Y-m-d');

            //         if (!is_null($labourContract) && $value <= $labourContract->ContractDate->format('Y-m-d')) {
            //             return $fail('Ngày hợp đồng phải lớn hơn ngày hợp đồng gần nhất ' . $labourContract->ContractDate->format('d-m-Y'));
            //         }

            //         if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractDate->format('Y-m-d')) {
            //             return $fail('Ngày hợp đồng phải lớn hơn ngày hợp đồng gần nhất ' . $probationaryContract->ContractDate->format('d-m-Y'));
            //         }
            //     },
            // ],
            'typeOfContractId' => 'required|exists:TypeOfContracts,Id',
            'divisionId' => 'required|exists:Divisions,Id',
            // 'contractFrom' => [
            //     'required', 'date',
            //     function ($attribute, $value, $fail) {
            //         $employeeId = request()->employeeId;
            //         $labourContract = LabourContract::where('EmployeeId', $employeeId)->where('IsEffect', true)->orderBy('CreationTime', 'DESC')->first();
            //         $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->where('IsEffect', true)->orderBy('CreationTime', 'DESC')->first();
            //         $value = Carbon::parse($value)->setTimezone('GMT+7')->format('Y-m-d');

            //         if (!is_null($labourContract) && $value <= $labourContract->ContractTo->format('Y-m-d')) {
            //             return $fail('Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng lao động gần nhất ' . $labourContract->ContractTo->format('d-m-Y'));
            //         }

            //         if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractFrom->format('Y-m-d')) {
            //             return $fail('Thời hạn từ phải lớn hơn thời hạn từ của hợp đồng thử việc gần nhất ' . $probationaryContract->ContractFrom->format('d-m-Y'));
            //         }
            //     },
            // ],
            'contractTo' => 'date',
            'positionId' => 'required|exists:Positions,Id',
            'work' => 'required|string',
            'workTime' => 'required|string',
            'branchId' => 'required|exists:Branches,Id',
        ];
    }
}
