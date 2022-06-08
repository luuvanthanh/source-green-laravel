<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TeacherTrainingBoardCreateRequest extends FormRequest
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
            'detail.createRows.*.trainingModuleId' => 'nullable|check_exists:evaluate-teacher.TrainingModules,Id',
            'detail.createRows.trainingModuleDetail.trainingModuleDetailId' => 'nullable|check_exists:evaluate-teacher.TrainingModuleDetails,Id',
            'detail.*.updateRows' => 'array',
            'detail.*.deleteRows' => 'array',
        ];
    }
}
