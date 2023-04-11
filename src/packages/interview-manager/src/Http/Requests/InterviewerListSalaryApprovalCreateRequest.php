<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewList;
use Illuminate\Foundation\Http\FormRequest;

class InterviewerListSalaryApprovalCreateRequest extends FormRequest
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
            'flag' => 'required|in:'.$status
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        
        if (!empty($data['status']) && $data['status'] != 'INTERVIEWED' && $data['status'] != 'NOT_INTERVIEWED_YET' && $data['status'] != 'NO_SALARY_APPROVAL' && $data['status'] != 'DO_NOT_APPROVECANDIDATES' && $data['status'] != 'APPROVED') {
           $data['status'] = array_key_exists($data['status'] , InterviewList::STATUS) ? InterviewList::STATUS[$data['status']] : 0;
        }
        
        if (!empty($data['flag']) && $data['flag'] != 'NOT_INTERVIEWED_YET' && $data['flag'] != 'INTERVIEWED' && $data['flag'] != 'PENDING') {
            $data['flag'] = array_key_exists($data['flag'] , InterviewList::STATUS) ? InterviewList::STATUS[$data['flag']] : 0;
         }

        return $data;
    }

    public function messages()
    {
        return [
            'status.in' => 'Giá trị đã chọn không hợp lệ, giá trị phải là PENDING',
            'flag.in' => 'Giá trị đã chọn không hợp lệ, giá trị phải là NO_SALARY_APPROVAL, DO_NOT_APPROVECANDIDATES, APPROVED'
        ];
    }
}
