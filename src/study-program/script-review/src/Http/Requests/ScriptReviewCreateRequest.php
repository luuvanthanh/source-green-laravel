<?php

namespace GGPHP\StudyProgram\ScriptReview\Http\Requests;

use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use Illuminate\Foundation\Http\FormRequest;

class ScriptReviewCreateRequest extends FormRequest
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
        return [];
    }

    public function all($key = null)
    {
        $data = parent::all();
        $data['type'] = ScriptReview::TYPE[$data['type']];
        
        return $data;
    }
}
