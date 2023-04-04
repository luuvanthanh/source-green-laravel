<?php

namespace GGPHP\InterviewManager\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InterviewerListCreateRequest extends FormRequest
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
            'interviewName' => 'required|string',
            'candidateName' => 'required|string',
            'location' => 'required|string',
            'divisionId' => 'required|exists:Divisions,Id',
            'file' => 'required|string',
            'interviewConfigurationId' => 'required|exists:InterviewConfigurations,Id',
            'employees' => 'required|array',
            'employees.*' => 'required|exists:Employees,Id',
            'date' => 'required|date|date_format:d-m-Y',
            'time' => 'nullable',
            'address' => 'required|string'
        ];
    }
}
