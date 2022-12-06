<?php

namespace GGPHP\StudyProgram\Setting\Http\Requests;

use GGPHP\StudyProgram\Setting\Models\SampleComment;
use GGPHP\StudyProgram\Setting\Models\Subject;
use Illuminate\Foundation\Http\FormRequest;

class SampleCommentCreateRequest extends FormRequest
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
            'name' => 'required|check_unique:study-program.SampleComments,Name',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();

        $result = SampleComment::orderBy('CreationTime', 'desc')->first();

        if (!is_null($result)) {
            $getInt = substr($result->Code, 2) + 1;
            $data['code'] = SampleComment::CODE . $getInt;
        } else {
            $data['code'] = SampleComment::CODE . '1';
        }

        return $data;
    }
}
