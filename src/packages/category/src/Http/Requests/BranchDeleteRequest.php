<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Appoint\Models\AppointDetail;
use GGPHP\Clover\Models\Classes;
use GGPHP\Dismissed\Models\DismissedDetail;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Transfer\Models\TransferDetail;
use Illuminate\Foundation\Http\FormRequest;

class BranchDeleteRequest extends FormRequest
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
                    $appointDetails = AppointDetail::where('BranchId', $value)->first();
                    $dismissedDetail = DismissedDetail::where('BranchId', $value)->first();
                    $positionLevel = PositionLevel::where('BranchId', $value)->first();
                    $labourContract = LabourContract::where('BranchId', $value)->first();
                    $probationaryContract = ProbationaryContract::where('BranchId', $value)->first();
                    $transferDetail = TransferDetail::where('BranchId', $value)->first();
                    $class = Classes::where('BranchId', $value)->first();

                    if (!is_null($appointDetails) || !is_null($dismissedDetail) || !is_null($positionLevel) || !is_null($labourContract)
                        || !is_null($probationaryContract) || !is_null($transferDetail) || !is_null($class)
                    ) {
                        return $fail('Dữ liệu đang được sử dụng!');
                    }
                },
            ],
        ];
    }
}
