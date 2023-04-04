<?php

namespace GGPHP\InterviewManager\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InterviewerUpdateRequest extends FormRequest
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
            'divisionId' => 'nullable|exists:Divisions,Id',
            'data' => 'nullable|array',
            'data.*' => 'nullable|exists:Employees,Id'
        ];
    }
}
