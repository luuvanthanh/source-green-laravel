<?php

namespace GGPHP\Profile\Http\Requests;

use Carbon\Carbon;
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
            'employeeId' => [
                'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($labourContract)) {
                        return $fail("Đã có hợp đồng lao động, không được chỉnh sửa hợp đồng thử việc.");
                    }

                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($probationaryContract) && $probationaryContract->Id != request()->id) {
                        return $fail("Hợp đồng không phải là mới nhất, không được phép chỉnh sửa.");
                    }
                },
            ],
            'id' => 'required',
            'contractNumber' => [
                'string',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $shift = ProbationaryContract::where('EmployeeId', $employeeId)->where('ContractNumber', $value)->where('Id', '!=', request()->id)->first();

                    if (!is_null($shift)) {
                        return $fail('Số hợp đồng đã tồn tại.');
                    }
                },
            ],
            'contractFrom' => [
                'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->where('Id', '!=', request()->id)->orderBy('CreationTime', 'DESC')->first();
                    $value = Carbon::parse($value)->setTimezone('GMT+7')->format('Y-m-d');

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractTo->format('Y-m-d')) {
                        return $fail("Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng thử việc gần nhất " . $probationaryContract->ContractTo->format('d-m-Y'));
                    }
                },
            ],
        ];
    }
}
