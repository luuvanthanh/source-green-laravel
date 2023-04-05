<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewList;
use Illuminate\Foundation\Http\FormRequest;

class InterviewerListCreateSendSuggestionsRequest extends FormRequest
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
        $status = implode(',', InterviewList::STATUS);

        return [
            'status' => 'required|in:'.$status,
            'suggestedSalary' => 'required|numeric',
            'pointEvaluationId' => 'required|exists:PointEvaluations,Id',
            'mediumScore' => 'required|numeric'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        if (!empty($data['status']) && $data['status'] != 'NOT_INTERVIEWED_YET' && $data['status'] != 'PENDING' && $data['status'] != 'DO_NOT_APPROVECANDIDATES' && $data['status'] != 'APPROVED') {
           $data['status'] = array_key_exists($data['status'] , InterviewList::STATUS) ? InterviewList::STATUS[$data['status']] : 0;
        }

        return $data;
    }

    public function messages()
    {
        return [
            'status.in' => 'Giá trị đã chọn trong trường phải là INTERVIEWED hoặc NO_SALARY_APPROVAL'
        ];
    }
}
