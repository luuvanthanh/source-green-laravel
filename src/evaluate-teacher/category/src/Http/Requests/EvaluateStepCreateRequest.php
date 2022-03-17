<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Requests;

use GGPHP\EvaluateTeacher\Category\Models\RatingLevel;
use GGPHP\EvaluateTeacher\Category\Models\EvaluateStep;
use Illuminate\Foundation\Http\FormRequest;

class EvaluateStepCreateRequest extends FormRequest
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
            'name' => ['string', 'required', function ($attribute, $value, $fail) {
                $evaluateStep = EvaluateStep::where('Name', $value)->first();

                if (!is_null($evaluateStep)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            }],
            'code' => ['string', 'required', function ($attribute, $value, $fail) {
                $evaluateStep = EvaluateStep::where('Code', $value)->first();

                if (!is_null($evaluateStep)) {
                    return $fail('Trường đã có trong cơ sở dữ liệu.');
                }
            }],
            'evaluateTypeId' => 'required|array'
        ];
    }
}
