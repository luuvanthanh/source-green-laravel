<?php

namespace GGPHP\ChildDevelop\Category\Http\Requests;

use GGPHP\ChildDevelop\Category\Models\NameAssessmentPeriod;
use Illuminate\Foundation\Http\FormRequest;

class NameAssessmentPeriodUpdateRequest extends FormRequest
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
            'id' => 'required',
            'name' => [
                function ($attribute, $value, $fail) {
                    $nameAssessmentPeriod = NameAssessmentPeriod::where('Name', $value)->where('Id', '!=', $this->id)->first();

                    if (is_null($nameAssessmentPeriod)) {
                        return true;
                    }

                    return $fail('Dữ liệu đã có trong hệ thống');
                },
            ],
        ];
    }
}
