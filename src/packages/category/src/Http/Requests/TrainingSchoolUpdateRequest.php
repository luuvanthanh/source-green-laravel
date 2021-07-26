<?php

namespace GGPHP\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrainingSchoolUpdateRequest extends FormRequest
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
                    $trainingSchool = \GGPHP\Category\Models\TrainingSchool::where('Name', $value)->where('Id', '!=', request()->id)->first();

                    if (!is_null($trainingSchool)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $trainingSchool = \GGPHP\Category\Models\TrainingSchool::where('Code', $value)->where('Id', '!=', request()->id)->first();

                    if (!is_null($trainingSchool)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
