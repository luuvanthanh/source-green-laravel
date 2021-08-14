<?php

namespace GGPHP\YoungAttendance\Absent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsentConfigTimeCreateOrUpdateRequest extends FormRequest
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
            'create_rows' => 'array',
            'update_rows' => 'array',
            'delete_rows' => 'array',
            'update_rows.*.from' => 'required|integer|gt:0',
            'update_rows.*.to' => 'required|integer|gt:0|gt:update_rows.*.from',
            'update_rows.*.advanceNotice' => 'required|integer|gt:0',
            'create_rows.*.from' => 'required|integer|gt:0',
            'create_rows.*.to' => 'required|integer|gt:0|gt:create_rows.*.from',
            'create_rows.*.advanceNotice' => 'required|integer|gt:0',
        ];
    }
}
