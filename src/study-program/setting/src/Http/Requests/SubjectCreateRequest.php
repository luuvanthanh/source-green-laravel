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
        return [
            'name' => 'required|check_unique:study-program.Subjects,Name',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();

        $result = Subject::orderBy('CreationTime', 'desc')->first();

        if (!is_null($result)) {
            $getInt = (int)ltrim($result->Code, 'A..z: ');
            $num = $getInt + 1;

            if ($getInt < 9) {
                $data['code'] = Subject::CODE . '00' . $num;
            } elseif ($getInt >= 9 && $getInt < 99) {
                $data['code'] = Subject::CODE . '0' . $num;
            } else {
                $data['code'] = Subject::CODE . $num;
            }
        } else {
            $data['code'] = Subject::CODE . '001';
        }

        return $data;
    }

    public function messages()
    {
        return [
            'check_unique' => 'The :attribute has already been taken.',
        ];
    }
}
