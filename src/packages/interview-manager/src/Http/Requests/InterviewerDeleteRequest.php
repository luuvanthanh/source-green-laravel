<?php

namespace GGPHP\InterviewManager\Http\Requests;

use GGPHP\InterviewManager\Models\InterviewerEmployee;
use Illuminate\Foundation\Http\FormRequest;

class InterviewerDeleteRequest extends FormRequest
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
                    // $interviewerEmployee = InterviewerEmployee::where('InterviewerId', $value)->first();
                    // if (!is_null($interviewerEmployee)) {

                    //     return $fail('Dữ liệu đã được sử dụng');
                    // }
                }
            ]
        ];
    }
}
