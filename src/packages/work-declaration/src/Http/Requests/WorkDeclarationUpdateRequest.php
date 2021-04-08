<?php

namespace GGPHP\WorkDeclaration\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkDeclarationUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
        ];
    }
}
