<?php

namespace GGPHP\SalaryIncrease\Http\Requests;

use Carbon\Carbon;
use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

class SalaryIncreaseCreateRequest extends FormRequest
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
            'decisionNumber' => 'unique:SalaryIncreases,DecisionNumber',
            'decisionDate' => 'required',
            'reason' => 'required',
            'employeeId' => [
                'required', 'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $labourContract = null;
                    $now = Carbon::now();
                    $labourContractUnlimited = LabourContract::where('EmployeeId', $value)->where('ContractFrom', '<=', $now->format('Y-m-d'))->orWhereHas('typeOfContract', function ($query) {
                        $query->where('IsUnlimited', true);
                    })->first();

                    if (is_null($labourContractUnlimited)) {
                        $labourContract = LabourContract::where('EmployeeId', $value)->where('ContractFrom', '<=', $now->format('Y-m-d'))->where('ContractTo', '>', $now->format('Y-m-d'))->first();
                    }

                    $probationaryContract = ProbationaryContract::where('EmployeeId', $value)->where('ContractFrom', '<=', $now->format('Y-m-d'))->where('ContractTo', '>', $now->format('Y-m-d'))->first();

                    if (is_null($labourContract)  && is_null($probationaryContract) && is_null($labourContractUnlimited)) {
                        return $fail('Chưa có hợp đồng không được tạo điều chuyển.');
                    }
                },
            ],
            'timeApply' => 'required',
            'numberForm' => 'required|exists:DecisionNumberSamples,NumberForm',
            'type' => 'required|in:' . DecisionNumberSample::TYPE['SALARY_INCREASES'],
            'decisionNumberSampleId' => 'required|uuid|exists:DecisionNumberSamples,Id',
            'ordinalNumber' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $decisionNumberSample = DecisionNumberSample::findOrFail($this->decisionNumberSampleId);

                    if ($value == $decisionNumberSample->OrdinalNumber) {
                        return $fail('Số thứ tự phải khác số đã có.');
                    }

                    return true;
                }
            ]
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        if (!empty($data['type'])) {
            $data['type'] = array_key_exists($data['type'], DecisionNumberSample::TYPE) ? DecisionNumberSample::TYPE[$data['type']] : 0;
        }

        return $data;
    }
}
