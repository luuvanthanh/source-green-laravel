<?php

namespace GGPHP\TeacherTimekeeping\Http\Requests;

use GGPHP\TeacherTimekeeping\Models\TeacherTimekeeping;
use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherTimekeepingRequest extends FormRequest
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
        $type = implode(',', array_keys(TeacherTimekeeping::TYPE));
        $status = implode(',', array_keys(TeacherTimekeeping::STATUS));

        return [
            'createRows.*.status' => 'nullable|string|in:' . $status,
            'createRows.*.type' => 'nullable|string|in:' . $type,
            'createRows.*.employeeId' => 'nullable|exists:Employees,Id',

            'updateRows.*.status' => 'nullable|string|in:' . $status,
            'updateRows.*.type' => 'nullable|string|in:' . $type,
            'updateRows.*.employeeId' => 'nullable|exists:Employees,Id',
        ];
    }
}
