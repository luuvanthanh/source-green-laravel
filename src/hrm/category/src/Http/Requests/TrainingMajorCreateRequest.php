<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\TrainingMajor;
use Illuminate\Foundation\Http\FormRequest;

class TrainingMajorCreateRequest extends FormRequest
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
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $trainingMajor = TrainingMajor::where('Name', $value)->first();

                    if (!is_null($trainingMajor)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $trainingMajor = TrainingMajor::where('Code', $value)->first();

                    if (!is_null($trainingMajor)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
        ];
    }
}
