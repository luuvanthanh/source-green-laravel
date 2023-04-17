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
        $status = implode(',', InterviewList::STATUS);
        return [
            'interviewName' => [
                'nullable', 'string',
                function ($attribute, $value, $fail) {
                    $interviewList = InterviewList::where('InterviewName', $value)->where('Id' , '!=', $this->interview_list)->first();

                    if (!is_null($interviewList)) {

                        return $fail('Dữ liệu đã có trong hệ thống');
                    }
                },
            ],
            'candidateName' => 'nullable|string',
            'location' => 'nullable|string',
            'divisionId' => 'nullable|exists:Divisions,Id',
            'file' => 'nullable|string',
            'interviewConfigurationId' => 'nullable|exists:InterviewConfigurations,Id',
            'employeeId' => 'nullable|array',
            'employeeId.*' => 'nullable|exists:Employees,Id',
            'date' => 'nullable|date|date_format:Y-m-d',
            'time' => 'nullable',
            'address' => 'nullable|string',
            'status' => 'required|in:'.$status
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();
        if (!empty($data['status']) && $data['status'] == 'NOT_INTERVIEWED_YET') {
            $data['status'] = array_key_exists($data['status'], InterviewList::STATUS) ? InterviewList::STATUS[$data['status']] : 0;
        }

        return $data;
    }

    public function messages()
    {
        return [
            'status.in' => 'Giá trị đã chọn không hợp lệ, giá trị phải là NOT_INTERVIEWED_YET'
        ];
    }
}
