<?php

namespace GGPHP\StudyProgram\Setting\Http\Requests;

use GGPHP\StudyProgram\Setting\Models\Subject;
use Illuminate\Foundation\Http\FormRequest;
use PhpParser\Node\Expr\FuncCall;

class SubjectCreateRequest extends FormRequest
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

    public function all($keys = null)
    {
        $data = parent::all();

        $subject = Subject::orderBy('CreationTime', 'desc')->first();

        if (!is_null($subject)) {
            $getInt = substr($subject->Code, 2) + 1;
            $data['code'] = Subject::CODE . $getInt;
        } else {
            $data['code'] = Subject::CODE . '1';
        }

        return $data;
    }
}
