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
            "employee_id" => "required|exists:employees,id",
            "data" => "required|array",
            "data.*.type" => "required|string",
            "data.*.reason" => "required|string",
            "data.*.time" => "required|array",
        ];
    }
}
