<?php

namespace GGPHP\PositionLevel\Http\Requests;

use Carbon\Carbon;
use GGPHP\PositionLevel\Models\PositionLevel;
use Illuminate\Foundation\Http\FormRequest;

class PositionLevelCreateRequest extends FormRequest
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
            'employeeId' => 'required',
            'positionId' => 'required',
            'divisionId' => 'required',
            'branchId' => 'required',
            'startDate' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $now = Carbon::now();
                    $today = $now->toDateString();
                    $employeeId = request()->EmployeeId;

                    $tranfer = PositionLevel::where('EmployeeId', $employeeId)->where('StartDate', '>', $today)->first();

                    if (!is_null($tranfer)) {
                        return $fail('Bạn đã tạo điều chuyển, vui lòng xem lại.');
                    }
                },
            ],
        ];
    }
}
