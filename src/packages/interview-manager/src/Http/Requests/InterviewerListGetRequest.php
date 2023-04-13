<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewList;
use Illuminate\Foundation\Http\FormRequest;

class InterviewerListGetRequest extends FormRequest
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
            'status' =>'nullable|in:'.$status
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();
        
        if (!empty($data['status'])) {
            $data['status'] = array_key_exists($data['status'], InterviewList::STATUS) ? InterviewList::STATUS[$data['status']] : 0;
        }

        return $data;
    }

    public function messages()
    {
        return [
            'status.in' => 'Trường trạng thái phải là NOT_INTERVIEWED_YET, INTERVIEWED, NO_SALARY_APPROVAL, PENDING, DO_NOT_APPROVECANDIDATES, APPROVED'       
        ];
    }
}
