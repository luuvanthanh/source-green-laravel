<?php

namespace GGPHP\Profile\Http\Requests;

use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

class ProbationaryContractUpdateRequest extends FormRequest
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
            'employeeId' => 'exists:Employees,Id',
            'contractNumber' => [
                'string',
                function ($attribute, $value, $fail) {
                    $shift = ProbationaryContract::where('ContractNumber', $value)->where('Id', '!=', request()->id)->first();

                    if (!is_null($shift)) {
                        return $fail('Số hợp đồng đã tồn tại.');
                    }
                },
            ],
            'contractFrom' => [
                'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->where('Id', '!=', request()->id)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($labourContract) && $value <= $labourContract->ContractFrom->format('Y-m-d')) {
                        return $fail("Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng gần nhất " . $labourContract->ContractFrom->format('d-m-Y'));
                    }

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractFrom->format('Y-m-d')) {
                        return $fail("Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng gần nhất " . $probationaryContract->ContractFrom->format('d-m-Y'));
                    }
                },
            ],
        ];
    }
}
