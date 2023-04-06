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
                    for ($i = 1; $i < count($value); $i++) {
                        $prevPointTo = $value[$i-1]["pointTo"];
                        $currentPointFrom = $value[$i]["pointFrom"];
                        
                        if ($prevPointTo >= $currentPointFrom) {
                            return $fail('Khoảng điểm từ của phần tử sau phải lớn hơn khoảng điểm đến của phần tử trước.');
                        }
                    }
                },
            ],
            'data.*.pointFrom' => 'required|numeric',
            'data.*.pointTo' => 'required|numeric|gt:data.*.pointFrom',
            'data.*.classification' => 'required|string'
        ];
    }
}
