<?php

namespace GGPHP\InterviewManager\Http\Requests;

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
            'pointEvaluation' => 'required|array',
            'pointEvaluation.*' => 'required|numeric',
            'comment' => 'nullable|array',
            'comment.*' => 'nullable|string',
        ];
    }
}
