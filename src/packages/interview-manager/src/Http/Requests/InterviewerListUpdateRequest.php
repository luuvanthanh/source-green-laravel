<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewList;
use Illuminate\Foundation\Http\FormRequest;

class InterviewerListUpdateRequest extends FormRequest
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
            'interviewName' => [
                'required', 'string',
                function ($attribute, $value, $fail) {
                    $interviewList = InterviewList::where('InterviewName', $value)->where('Id' , '!=', $this->interview_list)->first();

                    if (!is_null($interviewList)) {

                        return $fail('Dữ liệu đã có trong hệ thống');
                    }
                },
            ],
            'candidateName' => 'required|string',
            'location' => 'required|string',
            'divisionId' => 'required|exists:Divisions,Id',
            'file' => 'required|string',
            'interviewConfigurationId' => 'required|exists:InterviewConfigurations,Id',
            'employeeId' => 'required|array',
            'employeeId.*' => 'required|exists:Employees,Id',
            'date' => 'required|date|date_format:d-m-Y',
            'time' => 'nullable',
            'address' => 'required|string'
        ];
    }
}
