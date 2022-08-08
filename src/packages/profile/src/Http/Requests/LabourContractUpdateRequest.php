<?php

namespace GGPHP\Profile\Http\Requests;

use Carbon\Carbon;
use GGPHP\Category\Models\TypeOfContract;
use GGPHP\Profile\Http\Rules\ContractUpdateRule;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\NumberFormContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

class LabourContractUpdateRequest extends FormRequest
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
        $labourContract = LabourContract::findOrFail($this->labours_contract);

        return [
            'employeeId' => [
                'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->where('IsEffect', true)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($labourContract)  && $labourContract->Id != request()->id) {
                        return $fail('Hợp đồng không phải là mới nhất, không được phép chỉnh sửa.');
                    }
                },
            ],
            'contractFrom' => [
                'date',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $labourContract = LabourContract::where('EmployeeId', $employeeId)->where('Id', '!=', request()->labours_contract)->where('IsEffect', true)->orderBy('CreationTime', 'DESC')->first();
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $employeeId)->orderBy('CreationTime', 'DESC')->where('IsEffect', true)->first();
                    $value = Carbon::parse($value)->setTimezone('GMT+7')->format('Y-m-d');

                    if (!is_null($probationaryContract) && $value <= $probationaryContract->ContractFrom->format('Y-m-d')) {
                        return $fail('Thời hạn từ phải lớn hơn thời hạn từ của hợp đồng thử việc gần nhất ' . $probationaryContract->ContractFrom->format('d-m-Y'));
                    }

                    if (!is_null($labourContract) && $value <= $labourContract->ContractTo->format('Y-m-d')) {
                        return $fail('Thời hạn từ phải lớn hơn thời hạn đến của hợp đồng lao động gần nhất ' . $labourContract->ContractTo->format('d-m-Y'));
                    }
                },
            ],
            'contractTo' => 'nullable|date',
            'contractDate' => 'required|date|date_format:Y-m-d',
            'numberForm' => 'nullable|exists:NumberFormContracts,NumberForm',
            'ordinalNumber' => [
                'nullable',
                'string',
                new ContractUpdateRule($labourContract, $this->numberForm, $this->labours_contract)
            ]
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        if (!empty($data['typeOfContractId'])) {
            $typeContract = TypeOfContract::find($data['typeOfContractId']);

            if ($typeContract->IsUnlimited) {
                $data['contractTo'] = null;
            }
        }

        return $data;
    }
}
