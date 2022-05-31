<?php

namespace GGPHP\ManualCalculation\Http\Requests;

use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Profile\Models\SeasonalContract;
use Illuminate\Foundation\Http\FormRequest;

class CopyManualCalculationCreateRequest extends FormRequest
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
            'employeeId' => 'array|required|exists:ManualCalculations,EmployeeId',
            'month' => 'required|date_format:Y-m-d',
            'startDate' => 'required|date_format:Y-m-d',
            'endDate' => 'required|date_format:Y-m-d|after:startDate'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();
        $now = now()->format('Y-m-d');

        foreach ($data['employeeId'] as $key => $value) {
            $labourContract = LabourContract::where('EmployeeId', $value)->where('ContractFrom', '<=', $now)->where('ContractTo', '>=', $now)->first();
            $probationaryContract = ProbationaryContract::where('EmployeeId', $value)->where('ContractFrom', '<=', $now)->where('ContractTo', '>=', $now)->first();
            $seasonalContract = SeasonalContract::where('EmployeeId', $value)->where('ContractFrom', '<=', $now)->where('ContractTo', '>=', $now)->first();

            if (is_null($labourContract) && is_null($probationaryContract) && is_null($seasonalContract)) {
                unset($data[$value]);
            }
        }

        return $data;
    }
}
