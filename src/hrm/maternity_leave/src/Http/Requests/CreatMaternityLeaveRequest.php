<?php

namespace GGPHP\MaternityLeave\Http\Requests;

use GGPHP\MaternityLeave\Models\MaternityLeave;
use Illuminate\Foundation\Http\FormRequest;

class CreatMaternityLeaveRequest extends FormRequest
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
            'employeeId' => 'required|exists:Employees,Id',
            'startDate' => [
                'required',
                function ($attribute, $value, $fail) {
                    $employeeId = request()->employeeId;
                    $startDate = request()->startDate;
                    $endDate = request()->endDate;

                    $maternityLeave = MaternityLeave::where('EmployeeId', $employeeId)->where(function ($q2) use ($startDate, $endDate) {
                        $q2->where([['StartDate', '<=', $startDate], ['EndDate', '>=', $endDate]])
                            ->orWhere([['StartDate', '>=', $startDate], ['StartDate', '<=', $endDate]])
                            ->orWhere([['EndDate', '>=', $startDate], ['EndDate', '<=', $endDate]]);
                    })->get();

                    if (!empty(count($maternityLeave))) {
                        return $fail('Bạn đã nghỉ vào khoảng thời gian này.');
                    }

                    return true;
                },
            ],
            'endDate' => 'required',
        ];
    }
}
