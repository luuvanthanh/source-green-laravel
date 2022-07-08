<?php

namespace GGPHP\ManualCalculation\Http\Requests;

use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Profile\Models\SeasonalContract;
use Illuminate\Foundation\Http\FormRequest;

class fastManualCalculationCreateRequest extends FormRequest
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
            'data' => 'array',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();
        $now = now()->format('Y-m-d');

        foreach ($data['data'] as $key => $value) {

            $labourContract = LabourContract::where('EmployeeId', $value['employeeId'])->where('ContractFrom', '<=', $now)->where('ContractTo', '>=', $now)->first();
            $probationaryContract = ProbationaryContract::where('EmployeeId', $value['employeeId'])->where('ContractFrom', '<=', $now)->where('ContractTo', '>=', $now)->first();
            $seasonalContract = SeasonalContract::where('EmployeeId', $value['employeeId'])->where('ContractFrom', '<=', $now)->where('ContractTo', '>=', $now)->first();

            if (is_null($labourContract) && is_null($probationaryContract) && is_null($seasonalContract)) {
                unset($data['data'][$key]);
            }
        }

        return $data;
    }
}
