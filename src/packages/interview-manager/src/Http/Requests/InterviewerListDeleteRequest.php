<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewDetail;
use GGPHP\InterviewManager\Models\InterviewList;
use Illuminate\Foundation\Http\FormRequest;

class InterviewerListDeleteRequest extends FormRequest
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
            "id" => [
                'required',
                function ($attribute, $value, $fail) {
                    $interviewerListDetail = InterviewDetail::where('InterviewListId', $value)->first();
                    if (!is_null($interviewerListDetail)) {

                        return $fail('Dữ liệu đã được sử dụng');
                    }
                }
            ]
        ];
    }
}
