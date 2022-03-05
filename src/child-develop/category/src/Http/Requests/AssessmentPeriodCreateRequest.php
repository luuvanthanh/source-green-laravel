<?php

namespace GGPHP\ChildDevelop\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssessmentPeriodCreateRequest extends FormRequest
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
            'schoolYearId' => 'required',
            'startDate' => 'required|date_format:Y-m-d',
            'endDate' => 'required|date_format:Y-m-d',
            'branchId' => 'required',
            'classesId' => 'required'
        ];
    }
}
