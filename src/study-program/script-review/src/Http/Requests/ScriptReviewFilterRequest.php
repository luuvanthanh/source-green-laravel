<?php

namespace GGPHP\StudyProgram\ScriptReview\Http\Requests;

use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use Illuminate\Foundation\Http\FormRequest;

class ScriptReviewFilterRequest extends FormRequest
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
        $type = implode(',', array_keys(ScriptReview::TYPE));
        return [
            'type' => 'nullable|in:' . $type
        ];
    }

    public function messages()
    {
        return [
            'check_exists' => 'The selected :attribute is invalid.',
            'boolean' => 'The :attribute field must be true or false.',
            'array' => 'The :attribute must be an array.',
            'exists' => 'The selected :attribute is invalid.',
            'in' => 'The selected :attribute is invalid.',
        ];
    }
}
