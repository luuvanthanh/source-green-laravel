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

        $evaluationCriteria = EvaluationCriteria::orderBy('CreationTime', 'desc')->first();

        if (!is_null($evaluationCriteria)) {
            $getInt = substr($evaluationCriteria->Code, 2) + 1;
            $data['code'] = EvaluationCriteria::CODE . $getInt;
        } else {
            $data['code'] = EvaluationCriteria::CODE . '1';
        }

        return $data;
    }
}
