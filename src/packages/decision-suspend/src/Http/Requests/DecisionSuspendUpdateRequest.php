<?php

namespace GGPHP\DecisionSuspend\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DecisionSuspendUpdateRequest extends FormRequest
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
            'DecisionNumber' => 'unique:decisionSuspends,DecisionNumber',
        ];
    }
}
