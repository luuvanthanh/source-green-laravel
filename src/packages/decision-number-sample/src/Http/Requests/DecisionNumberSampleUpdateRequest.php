<?php

namespace GGPHP\DecisionNumberSample\Http\Requests;

use GGPHP\Appoint\Models\Appoint;
use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use GGPHP\DecisionSuspend\Models\DecisionSuspend;
use GGPHP\Dismissed\Models\Dismissed;
use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\Reward\Models\DecisionReward;
use GGPHP\SalaryIncrease\Models\SalaryIncrease;
use GGPHP\Transfer\Models\Transfer;
use Illuminate\Foundation\Http\FormRequest;

class DecisionNumberSampleUpdateRequest extends FormRequest
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
        $id = $this->route('number_form_contract');
        $types = implode(',', array_values(DecisionNumberSample::TYPE));

        return [
            'ordinalNumber' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) use ($id) {
                    $model = DecisionNumberSample::findOrFail($id);

                    if ($value >= $model->OrdinalNumber) {
                        return true;
                    }

                    return $fail('Số thứ tự phải lớn hơn số đã có.');
                }
            ],
            'type' => 'nullable|in:' . $types,
            'numberForm' => [
                'nullable',
                function ($attribute, $value, $fail) use ($id) {
                    $decisionNumber = DecisionNumberSample::where('Id', '!=', $id)->where('Type', $this->type)->where('NumberForm', $value)->get();

                    if ($decisionNumber->isEmpty()) {
                        return true;
                    }

                    return $fail('Mẫu số  quyết định đã tồn tại.');
                },
                function ($attribute, $value, $fail) use ($id) {
                    $decisionNumberSample  = DecisionNumberSample::findOrFail($id);

                    if ($value != $decisionNumberSample->NumberForm) {
                        switch ($decisionNumberSample->Type) {
                            case DecisionNumberSample::TYPE['TRANSFER']:
                                $decision = Transfer::where('NumberForm', $decisionNumberSample->NumberForm)->get();
                                break;
                            case DecisionNumberSample::TYPE['APPOINT']:
                                $decision = Appoint::where('NumberForm', $decisionNumberSample->NumberForm)->get();
                                break;
                            case DecisionNumberSample::TYPE['DISMISSED']:
                                $decision = Dismissed::where('NumberForm', $decisionNumberSample->NumberForm)->get();
                                break;
                            case DecisionNumberSample::TYPE['DISCIPLINE_REWARD']:
                                $decision = DecisionReward::where('NumberForm', $decisionNumberSample->NumberForm)->get();
                                break;
                            case DecisionNumberSample::TYPE['SALARY_INCREASES']:
                                $decision = SalaryIncrease::where('NumberForm', $decisionNumberSample->NumberForm)->get();
                                break;
                            case DecisionNumberSample::TYPE['RESIGNATION']:
                                $decision = ResignationDecision::where('NumberForm', $decisionNumberSample->NumberForm)->get();
                                break;
                            case DecisionNumberSample::TYPE['SUSPEND']:
                                $decision = DecisionSuspend::where('NumberForm', $decisionNumberSample->NumberForm)->get();
                                break;
                            default:
                                $decision = collect();
                                break;
                        }

                        if ($decision->isNotEmpty()) {
                            return $fail('Mẫu số đã áp dụng cho quyết định');
                        }

                        return true;
                    }

                    return true;
                }
            ],
            'startDate' => [
                'nullable',
                'date_format:Y-m-d',
                'before_or_equal:endDate',
                function ($attribute, $value, $fail) use ($id) {
                    $numberFormContracts = DecisionNumberSample::where('Type', $this->type)->where(function ($query) use ($value) {
                        $query->where([
                            ['StartDate', '<=', $value],
                            ['EndDate', '>=', $value]
                        ])->orWhere([
                            ['StartDate', '>=', $value],
                            ['EndDate', '<=', $this->endDate]
                        ])->orWhere([
                            ['StartDate', '>=', $value],
                            ['StartDate', '<=', $this->endDate]
                        ]);
                    })->where('Id', '!=', $id)->get();

                    if ($numberFormContracts->isEmpty()) {
                        return true;
                    }

                    return $fail('Thời gian hiệu lực trùng.');;
                }
            ],
            'endDate' => 'nullable|date_format:Y-m-d|after_or_equal:startDate',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        $data['type'] = array_key_exists($data['type'], DecisionNumberSample::TYPE) ? DecisionNumberSample::TYPE[$data['type']] : 0;

        return $data;
    }
}
