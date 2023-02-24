<?php

namespace GGPHP\StudyProgram\Setting\Http\Requests;

use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewComment;
use GGPHP\StudyProgram\Setting\Models\SampleComment;
use GGPHP\StudyProgram\Setting\Models\Subject;
use Illuminate\Foundation\Http\FormRequest;

class SampleCommentDeleteRequest extends FormRequest
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
                    $scriptReviewComment = ScriptReviewComment::where('SampleCommentId', $value)->get();

                    if ($scriptReviewComment->isNotEmpty()) {
                        return $fail('Data is being used.');
                    }
                }
            ],
        ];
    }
}
