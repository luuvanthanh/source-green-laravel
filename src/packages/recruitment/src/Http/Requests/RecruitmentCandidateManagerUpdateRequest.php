<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\Level;
use GGPHP\Recruitment\Models\RecruitmentCandidateManagement;
use GGPHP\Recruitment\Models\RecruitmentLevel;
use Illuminate\Foundation\Http\FormRequest;

class RecruitmentCandidateManagerUpdateRequest extends FormRequest
{
    /**
     * Determine if the employee is authorized to make this request.
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
        $status = implode(',', RecruitmentCandidateManagement::STATUS);
        return [
            'status' => 'required|in:'.$status
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        if (!empty($data['status'] && $data['status'] != 'UNCONFIMRED')) {
           $data['status'] = array_key_exists($data['status'] , RecruitmentCandidateManagement::STATUS) ? RecruitmentCandidateManagement::STATUS[$data['status']] : 0;
        }
        
        return $data;
    }

    public function messages()
    {
        return [
            'status.in' => 'Giá trị đã chọn trong trường phải thuộc NOT_ACHIEVED, PASS'
        ];
    }
}
