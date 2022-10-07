<?php

namespace GGPHP\Profile\Http\Requests;

use Carbon\Carbon;
use GGPHP\Profile\Http\Rules\ContractUpdateRule;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Profile\Models\SeasonalContract;
use Illuminate\Foundation\Http\FormRequest;

class SeasonalContractUpdateRequest extends FormRequest
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
        $seasonalContract = SeasonalContract::findOrFail($this->id);

        return [
            'id' => 'required',
            'employeeId' => [
                'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $seasonalContract = SeasonalContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($seasonalContract)  && $seasonalContract->Id != request()->id) {
                        return $fail('Hợp đồng không phải là mới nhất, không được phép chỉnh sửa.');
                    }
                },
            ],
            'contractFrom' => [
                'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->where('Id', '!=', request()->id)->orderBy('CreationTime', 'DESC')->first();
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->where('Id', '!=', request()->id)->orderBy('CreationTime', 'DESC')->first();
                    $seasonalContract = SeasonalContract::where('EmployeeId', $employeeId)->where('Id', '!=', request()->id)->orderBy('CreationTime', 'DESC')->first();
                    $value = Carbon::parse($value)->setTimezone('GMT+7')->format('Y-m-d');

                    if (!is_null($seasonalContract) && $value <= $seasonalContract->ContractTo->format('Y-m-d')) {
                        return $fail('Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng thời vụ gần nhất ' . $seasonalContract->ContractTo->format('d-m-Y'));
                    }

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractTo->format('Y-m-d')) {
                        return $fail('Thời hạn từ phải lớn hơn thời hạn từ của hợp đồng thử việc gần nhất ' . $probationaryContract->ContractFrom->format('d-m-Y'));
                    }

                    if (!is_null($labourContract)) {
                        $typeOfContract = $labourContract->typeOfContract;
                        
                        if (!is_null($typeOfContract) && $typeOfContract->Code =='VTH') {
                            return $fail('Đã có hợp đồng lao động vô thời hạn, không được chỉnh sửa ngày hợp đồng đến hợp đồng thời vụ.');
                        }
                    
                        if ($value <= $labourContract->ContractTo->format('Y-m-d')) {
                            return $fail('Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng lao động gần nhất ' . $labourContract->ContractTo->format('d-m-Y'));
                        }
                    }
                },
            ],
            'numberForm' => 'nullable|exists:NumberFormContracts,NumberForm',
            'ordinalNumber' => [
                'nullable',
                'string',
                new ContractUpdateRule($seasonalContract, $this->numberForm, $this->id)
            ]
        ];
    }
}
