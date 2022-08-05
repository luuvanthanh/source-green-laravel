<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrainingScheduleCreateRequest extends FormRequest
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
            'data.*.employeeId' => 'array|exists:Employees,Id',
            'data.*.trainingModuleId' => 'check_exists:evaluate_teacher.TrainingModules,Id',
            'data.*.trainingModuleDetailId' => 'check_exists:evaluate_teacher.TrainingModuleDetails,Id',
            'data.*.startDate' => 'required|date_format:Y-m-d',
            'data.*.endDate' => 'nullable|date_format:Y-m-d|after_or_equal:data.*.startDate',
            'data.detail.createRows.*.employeeId' => 'nullable|array|exists:Employees,Id',
            'data.detail.createRows.*.trainer' => 'nullable|array|exists:Employees,Id',
            'detail.*.updateRows' => 'array',
            'detail.*.deleteRows' => 'array',
        ];
    }
}
