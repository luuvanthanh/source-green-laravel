<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewDetail;
use GGPHP\InterviewManager\Models\InterviewList;
use Illuminate\Foundation\Http\FormRequest;

class InterviewerListCreateCompletedInterviewRequest extends FormRequest
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
            'interviewListId' => 'required|exists:InterviewLists,Id',
            'evaluate' => 'required|array',
            'evaluate.*.employeeId' => [
                'required','exists:Employees,Id',
                function($atribute, $value, $fail){
                    $interviewDetail = InterviewDetail::where('InterviewListId', $this->id)->where('EmployeeId', $value)->first();

                    if (!is_null($interviewDetail)) {

                        return 'Mỗi nhân viên chỉ được đánh giá một lần';
                    }
                }
            ],
            'evaluate.*.pointEvaluation' => 'required|array',
            'evaluate.*.pointEvaluation.*' => 'required|integer',
            'evaluate.*.comment' => 'nullable|array',
            'evaluate.*.comment.*' => 'nullable|string'
        ];
    }
}
