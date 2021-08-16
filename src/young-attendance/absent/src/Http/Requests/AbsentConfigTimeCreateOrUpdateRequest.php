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
            'createRows' => 'array',
            'updateRows' => 'array',
            'deleteRows' => 'array',
            'updateRows.*.from' => 'required|integer|gt:0',
            'updateRows.*.to' => 'required|integer|gt:0|gt:updateRows.*.from',
            'updateRows.*.advanceNotice' => 'required|integer|gt:0',
            'createRows.*.from' => 'required|integer|gt:0',
            'createRows.*.to' => 'required|integer|gt:0|gt:createRows.*.from',
            'createRows.*.advanceNotice' => 'required|integer|gt:0',
        ];
    }
}
