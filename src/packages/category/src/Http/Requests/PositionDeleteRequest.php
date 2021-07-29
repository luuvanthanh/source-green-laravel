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

class PositionDeleteRequest extends FormRequest
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
                    $appointDetails = AppointDetail::where('PositionId', $value)->first();
                    $dismissedDetail = DismissedDetail::where('PositionId', $value)->first();
                    $positionLevel = PositionLevel::where('PositionId', $value)->first();
                    $labourContract = LabourContract::where('PositionId', $value)->first();
                    $probationaryContract = ProbationaryContract::where('PositionId', $value)->first();
                    $transferDetail = TransferDetail::where('PositionId', $value)->first();

                    if (
                        !is_null($appointDetails) || !is_null($dismissedDetail) || !is_null($positionLevel) || !is_null($labourContract)
                        || !is_null($probationaryContract) || !is_null($transferDetail)
                    ) {
                        return $fail('Dữ liệu đang được sử dụng!');
                    }
                },
            ],
        ];
    }
}
