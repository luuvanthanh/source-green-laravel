<?php

namespace GGPHP\DecisionNumberSample\Http\Requests;

use GGPHP\Appoint\Models\AppointDetail;
use GGPHP\Clover\Models\Classes;
use GGPHP\Dismissed\Models\DismissedDetail;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
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
            
        ];
    }
}
