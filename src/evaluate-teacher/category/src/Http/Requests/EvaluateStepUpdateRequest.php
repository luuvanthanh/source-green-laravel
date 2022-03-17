<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\EvaluateStep;
use Illuminate\Foundation\Http\FormRequest;

class EvaluateStepUpdateRequest extends FormRequest
{
    /**
     * Determine if the employee is authorized to make this request.
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
            'name' => [
                'string',
                function ($attribute, $value, $fail) {
                    $typeTeacher = EvaluateStep::where('Name', $value)->where('Id', '!=', request()->evaluate_step)->first();

                    if (!is_null($typeTeacher)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $typeTeacher = EvaluateStep::where('Code', $value)->where('Id', '!=', request()->evaluate_step)->first();

                    if (!is_null($typeTeacher)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
