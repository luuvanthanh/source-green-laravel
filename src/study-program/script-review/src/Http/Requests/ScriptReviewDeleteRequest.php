<?php

namespace GGPHP\StudyProgram\ScriptReview\Http\Requests;

use GGPHP\StudyProgram\QuarterReport\Models\QuarterReport;
use Illuminate\Foundation\Http\FormRequest;

class ScriptReviewDeleteRequest extends FormRequest
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
                    $quarterReport = QuarterReport::where('ScriptReviewId', $value)->get();
                    
                    if ($quarterReport->isNotEmpty()) {
                        return $fail('Data is being used.');
                    }
                }
            ],
        ];
    }
}
