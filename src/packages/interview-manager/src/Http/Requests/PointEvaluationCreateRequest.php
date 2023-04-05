<?php

namespace GGPHP\InterviewManager\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PointEvaluationCreateRequest extends FormRequest
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
            'data' => [
                'array', 'nullable',
                function ($attribute, $value, $fail) {
                    foreach ($value as $key => $item) {
                        if ($value[$key + 1]['pointFrom'] > $value[$key]['pointTo']) {
                            return true;
                        }else {
                            return $fail('Dữ liệu pointTo không được trùng với pointFrom');
                        }
                    }
                    // $evaluationCriteria = EvaluationCriteria::where('Name', $value)->where('Id' , '!=', $this->evaluation_criteria)->first();

                    // if (!is_null($evaluationCriteria)) {

                    //     return $fail('Dữ liệu đã có trong hệ thống');
                    // }
                },
            ],
            'data.*.pointFrom' => 'required|numeric',
            'data.*.pointTo' => 'required|numeric|gt:data.*.pointFrom',
            'data.*.classification' => 'required|string'
        ];
    }
}
