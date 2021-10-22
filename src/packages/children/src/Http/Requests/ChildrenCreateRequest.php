<?php

namespace GGPHP\Children\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ChildrenCreateRequest extends FormRequest
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
    public function rules(Request $request)
    {
        return [
            'employeeId' => 'required|exists:Employees,Id',
            'data' => 'required|array',
            'data.*.fullName' => 'required|string',
            'data.*.birthday' => 'date|date_format:Y-m-d',
            'data.*.DedectionTimeFrom' => 'date|date_format:Y-m-d',
            'data.*.DedectionTimeTo' => 'date|date_format:Y-m-d',
        ];
    }
}
