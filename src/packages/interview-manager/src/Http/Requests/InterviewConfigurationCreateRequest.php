<?php

namespace GGPHP\InterviewManager\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InterviewConfigurationCreateRequest extends FormRequest
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
            'divisionId' => 'required|exists:Divisions,Id',
            'name' => 'required|string|unique:InterviewConfigurations,Name',
            'note' => 'required|string',
            'data' => 'nullable|array',
            'data.*' => 'required|exists:EvaluationCriterias,Id'
        ];
    }
}
