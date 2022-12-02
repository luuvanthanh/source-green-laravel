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
<<<<<<< HEAD
        return [];
=======
        return [
            'name' => 'required|check_unique:study-program.Subjects,Name',
        ];
>>>>>>> f26c4c9ce7dd9a40420dc2f9b4ac187684f9ea2b
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
