<?php

namespace GGPHP\StudyProgram\Setting\Http\Requests;

use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubject;
use Illuminate\Foundation\Http\FormRequest;

class SubjectDeleteRequest extends FormRequest
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
                    $scriptReviewSubject = ScriptReviewSubject::where('SubjectId', $value)->get();

                    if ($scriptReviewSubject->isNotEmpty()) {
                        return $fail('Data is being used.');
                    }
                }
            ],
        ];
    }
}
