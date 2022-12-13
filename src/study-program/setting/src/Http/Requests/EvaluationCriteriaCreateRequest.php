<?php

namespace GGPHP\StudyProgram\Setting\Http\Requests;

use GGPHP\StudyProgram\Setting\Models\EvaluationCriteria;
use Illuminate\Foundation\Http\FormRequest;

class EvaluationCriteriaCreateRequest extends FormRequest
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
            'name' => 'required|check_unique:study-program.EvaluationCriterias,Name',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();

        $result = EvaluationCriteria::orderBy('CreationTime', 'desc')->first();

        if (!is_null($result)) {
            $getInt = (int)ltrim($result->Code, 'A..z: ');
            $num = $getInt + 1;

            if ($getInt < 9) {
                $data['code'] = EvaluationCriteria::CODE . '00' . $num;
            } elseif ($getInt >= 9 && $getInt < 99) {
                $data['code'] = EvaluationCriteria::CODE . '0' . $num;
            } else {
                $data['code'] = EvaluationCriteria::CODE . $num;
            }
        } else {
            $data['code'] = EvaluationCriteria::CODE . '1';
        }

        return $data;
    }
}
