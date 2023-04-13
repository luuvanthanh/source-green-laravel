<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\Interviewer;
use GGPHP\InterviewManager\Models\InterviewerEmployee;
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $interviewerEmployee = InterviewerEmployee::where('InterviewerId', $value)->first();
                    if (!is_null($interviewerEmployee)) {

                        return $fail('Dữ liệu đã được sử dụng');
                    }
                }
            ],
            'divisionId' => [
                'nullable','exists:Divisions,Id',
                function ($attribute, $value, $fail) {
                    $interviewer = Interviewer::where('DivisionId', $value)->where('Id', '!=', $this->interviewer)->first();
                    if (!is_null($interviewer)) {

                        return $fail('Dữ liệu đã có trong hệ thống');
                    }
                }
            ],
            'employeeId' => 'nullable|array',
            'employeeId.*' => 'nullable|exists:Employees,Id'
        ];
    }
}
