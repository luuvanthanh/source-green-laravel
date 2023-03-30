<?php

namespace GGPHP\DecisionNumberSample\Http\Requests;

use GGPHP\Appoint\Models\Appoint;
use GGPHP\Appoint\Models\AppointDetail;
use GGPHP\Clover\Models\Classes;
use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use GGPHP\DecisionSuspend\Models\DecisionSuspend;
use GGPHP\Dismissed\Models\Dismissed;
use GGPHP\Dismissed\Models\DismissedDetail;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\Reward\Models\DecisionReward;
use GGPHP\SalaryIncrease\Models\SalaryIncrease;
use GGPHP\Transfer\Models\Transfer;
use GGPHP\Transfer\Models\TransferDetail;
use Illuminate\Foundation\Http\FormRequest;

class DecisionNumberSampleDeleteRequest extends FormRequest
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
            'id' => function ($attribute, $value, $fail) {
                $decisionNumberSample = DecisionNumberSample::findOrFail($value);

                switch ($decisionNumberSample->Type) {
                    case DecisionNumberSample::TYPE['TRANSFER']:
                        $decision = Transfer::where('NumberForm', $decisionNumberSample->NumberForm)->first();
                        break;
                    case DecisionNumberSample::TYPE['APPOINT']:
                        $decision = Appoint::where('NumberForm', $decisionNumberSample->NumberForm)->first();
                        break;
                    case DecisionNumberSample::TYPE['DISMISSED']:
                        $decision = Dismissed::where('NumberForm', $decisionNumberSample->NumberForm)->first();
                        break;
                    case DecisionNumberSample::TYPE['DISCIPLINE_REWARD']:
                        $decision = DecisionReward::where('NumberForm', $decisionNumberSample->NumberForm)->first();
                        break;
                    case DecisionNumberSample::TYPE['SALARY_INCREASES']:
                        $decision = SalaryIncrease::where('NumberForm', $decisionNumberSample->NumberForm)->first();
                        break;
                    case DecisionNumberSample::TYPE['RESIGNATION']:
                        $decision = ResignationDecision::where('NumberForm', $decisionNumberSample->NumberForm)->first();
                        break;
                    case DecisionNumberSample::TYPE['SUSPEND']:
                        $decision = DecisionSuspend::where('NumberForm', $decisionNumberSample->NumberForm)->first();
                        break;
                    default:
                        $decision = null;
                        break;
                }

                if (!is_null($decision)) {
                    return $fail('Mẫu số đã áp dụng cho quyết định');
                }
            }
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();

        $data['id'] = $this->route('decision_number_sample');

        return $data;
    }
}
