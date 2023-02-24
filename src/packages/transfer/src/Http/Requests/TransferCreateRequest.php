<?php

namespace GGPHP\Transfer\Http\Requests;

use Carbon\Carbon;
use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

class TransferCreateRequest extends FormRequest
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
            'decisionDate' => 'required|after_or_equal:today',
            'timeApply' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $value = Carbon::parse($value)->format('Y-m-d');
                    $data = request()->data;
                    $tranfer = \GGPHP\PositionLevel\Models\PositionLevel::where('EmployeeId', $data[0]['employeeId'])->where('StartDate', '>=', $value)->first();

                    if (!is_null($tranfer)) {
                        $startDate = $tranfer->StartDate->format('d-m-Y');
                        return $fail('Thời gian áp dụng phải lớn hơn ngày' . $startDate . '.');
                    }
                },
            ],
            'data' => [
                'required',
                'array'
            ],
            'data.*.employeeId' => [
                'exists:Employees,Id',
                function ($attribute, $value, $fail) {
                    $now = Carbon::now();
                    $labourContract = LabourContract::where('EmployeeId', $value)->where('ContractFrom', '<=', $now->format('Y-m-d'))->where('ContractTo', '>', $now->format('Y-m-d'))->first();
                    $probationaryContract = ProbationaryContract::where('EmployeeId', $value)->where('ContractFrom', '<=', $now->format('Y-m-d'))->where('ContractTo', '>', $now->format('Y-m-d'))->first();

                    if (is_null($labourContract)  && is_null($probationaryContract)) {
                        return $fail('Chưa có hợp đồng không được tạo điều chuyển.');
                    }
                },
            ],
            'data.*.branchId' => 'required',
            'data.*.divisionId' => 'required',
            'data.*.positionId' => 'required',
            'numberForm' => 'required|exists:DecisionNumberSamples,NumberForm',
            'type' => 'required|in:' . DecisionNumberSample::TYPE['TRANSFER'],
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

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'decisionDate.after_or_equal' => 'Trường phải là ngày hiện tại hoặc sau ngày hiện tại.',
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
