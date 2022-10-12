<?php

namespace GGPHP\Profile\Http\Requests;

use Carbon\Carbon;
use GGPHP\Profile\Http\Rules\ContractCreateRule;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\NumberFormContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Profile\Models\SeasonalContract;
use Illuminate\Foundation\Http\FormRequest;

class SeasonalContractCreateRequest extends FormRequest
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
            'contractDate' => [
                'required', 'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $seasonalContract = SeasonalContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $value = Carbon::parse($value)->setTimezone('GMT+7')->format('Y-m-d');
                    $now = Carbon::now()->setTimezone('GMT+7')->format('Y-m-d');

                    if (!is_null($seasonalContract) && $value <= $seasonalContract->ContractDate->format('Y-m-d')) {
                        return $fail('Ngày hợp đồng phải lớn hơn ngày hợp đồng gần nhất ' . $seasonalContract->ContractDate->format('d-m-Y'));
                    }

                    if (!is_null($labourContract) && $value <= $labourContract->ContractDate->format('Y-m-d')) {
                        return $fail('Ngày hợp đồng phải lớn hơn ngày hợp đồng gần nhất ' . $labourContract->ContractDate->format('d-m-Y'));
                    }

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractDate->format('Y-m-d')) {
                        return $fail('Ngày hợp đồng phải lớn hơn ngày hợp đồng gần nhất ' . $probationaryContract->ContractDate->format('d-m-Y'));
                    }
                },
            ],
            'typeOfContractId' => 'required|exists:TypeOfContracts,Id',
            'divisionId' => 'required|exists:Divisions,Id',
            'contractFrom' => [
                'required', 'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $seasonalContract = SeasonalContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->first();
                    $value = Carbon::parse($value)->setTimezone('GMT+7')->format('Y-m-d');

                    if (!is_null($seasonalContract) && $value <= $seasonalContract->ContractTo->format('Y-m-d')) {
                        return $fail('Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng thời vụ gần nhất ' . $seasonalContract->ContractTo->format('d-m-Y'));
                    }

                    if (!is_null($labourContract)) {
                        $typeOfContract = $labourContract->typeOfContract;
                        
                        if (!is_null($typeOfContract) && $typeOfContract->Code =='VTH') {
                            return $fail('Đã có hợp đồng lao động vô thời hạn, không được tạo hợp đồng thời vụ.');
                        }
                    
                        if ($value <= $labourContract->ContractTo->format('Y-m-d')) {
                            return $fail('Ngày hợp đồng phải lớn hơn ngày hợp đồng gần nhất ' . $labourContract->ContractTo->format('d-m-Y'));
                        }
                    }

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractTo->format('Y-m-d')) {
                        return $fail('Thời hạn từ phải lớn hơn thời hạn từ của hợp đồng thử việc gần nhất ' . $probationaryContract->ContractFrom->format('d-m-Y'));
                    }
                },
            ],
            'contractTo' => 'date',
            'positionId' => 'required|exists:Positions,Id',
            'workDetail' => 'required|string',
            'workTime' => 'required|string',
            'branchId' => 'required|exists:Branches,Id',
            'numberForm' => 'required|exists:NumberFormContracts,NumberForm',
            'type' => 'required|in:'. NumberFormContract::TYPE['SEASONAL'],
            'numberFormContractId' => 'required|uuid|exists:NumberFormContracts,Id',
            'ordinalNumber' => [
                'required',
                'string',
                new ContractCreateRule($this->numberFormContractId),
            ]
        ];
    }


    public function all($keys = null)
    {
        $data = parent::all($keys);

        if (!empty($data['type'])) {
            $data['type'] = array_key_exists($data['type'], NumberFormContract::TYPE) ? NumberFormContract::TYPE[$data['type']] : 0;
        }

        return $data;
    }
}
