<?php

namespace GGPHP\WorkDeclaration\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkDeclarationCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            "employeeId" => "required|exists:Employees,Id",
            "data" => "required|array",
            "data.*.type" => "required|string",
            "data.*.reason" => "required|string",
            "data.*.time" => "required|array",
        ];
    }
}
