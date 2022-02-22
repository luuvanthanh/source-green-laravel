<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Appoint\Models\AppointDetail;
use GGPHP\Clover\Models\Classes;
use GGPHP\Dismissed\Models\DismissedDetail;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\ShiftSchedule\Models\DivisionShift;
use GGPHP\Transfer\Models\TransferDetail;
use Illuminate\Foundation\Http\FormRequest;

class DivisionDeleteRequest extends FormRequest
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $appointDetails = AppointDetail::where('DivisionId', $value)->first();
                    $dismissedDetail = DismissedDetail::where('DivisionId', $value)->first();
                    $positionLevel = PositionLevel::where('DivisionId', $value)->first();
                    $labourContract = LabourContract::where('DivisionId', $value)->first();
                    $probationaryContract = ProbationaryContract::where('DivisionId', $value)->first();
                    $transferDetail = TransferDetail::where('DivisionId', $value)->first();
                    $divisionShift = DivisionShift::where('DivisionId', $value)->first();

                    if (!is_null($appointDetails) || !is_null($dismissedDetail) || !is_null($positionLevel) || !is_null($labourContract)
                        || !is_null($probationaryContract) || !is_null($transferDetail) || !is_null($divisionShift)
                    ) {
                        return $fail('Dữ liệu đang được sử dụng!');
                    }
                },
            ],
        ];
    }
}
