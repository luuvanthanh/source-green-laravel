<?php

namespace GGPHP\DocumentManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class DocumentManagementCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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
            'typeOfDocument' => 'required|string',
            'topic' => 'required|string',
            'sentDivisionId' => 'required|exists:Divisions,Id',
            'employeeId' => 'required|exists:Employees,Id',
            'branchId' => 'nullable|exists:Branches,Id',
            'receiveDivisionId' => 'nullable|exists:Divisions,Id',
            'title' => 'string',
            'content' => 'string',
            'detail' => 'array',
        ];
    }
}
