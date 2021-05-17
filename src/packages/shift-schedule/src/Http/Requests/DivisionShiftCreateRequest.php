<?php

namespace GGPHP\ShiftSchedule\Http\Requests;

use GGPHP\ShiftSchedule\Models\DivisionShift;
use Illuminate\Foundation\Http\FormRequest;

class DivisionShiftCreateRequest extends FormRequest
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
            'employeeCreateId' => 'required|exists:Employees,Id',
            'divisionId' => 'required|exists:Divisions,Id',
            'shiftId' => 'required|exists:Shifts,Id',
            'startDate' => [
                'required', 'after:today',
                function ($attribute, $value, $fail) {
                    $divisionId = request()->divisionId;
                    $shift = DivisionShift::where('DivisionId', $divisionId)->orderBy('CreationTime', 'DESC')->first();

                    if (!is_null($shift) && $value <= $shift->StartDate->format('Y-m-d')) {
                        return $fail("Thời gian bắt đầu phải lớn hơn " . $shift->StartDate->format('d-m-Y'));
                    }
                },
            ],
            'endDate' => [
                'required', 'after:startDate',
            ],
        ];
    }
}
