<?php

namespace GGPHP\ChildDevelop\Category\Http\Requests;

use GGPHP\ChildDevelop\Category\Models\AssessmentPeriod;
use GGPHP\ChildDevelop\Category\Models\NameAssessmentPeriod;
use Illuminate\Foundation\Http\FormRequest;

class NameAssessmentPeriodDeleteRequest extends FormRequest
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $checkId = $this->checkAccessDelete($value);

                    if ($checkId) {
                        return true;
                    }
                    
                    return $fail('Dữ liệu đang được sử dụng');
                },
            ],
        ];
    }

    private function checkAccessDelete($id)
    {
        $nameAssessmentPeriod = AssessmentPeriod::where('NameAssessmentPeriodId', $id)->first();

        if (is_null($nameAssessmentPeriod)) {
            return true;
        }

        return false;
    }
}
