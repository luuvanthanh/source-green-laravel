<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\Grade;
use GGPHP\Category\Models\GradeDetail;
use Illuminate\Foundation\Http\FormRequest;

class GradeUpdateRequest extends FormRequest
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
                    $grade = Grade::where('Name', $value)->where('Id', '!=', request()->grade)->first();

                    if (!is_null($grade)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'code' => [
                'string',
                function ($attribute, $value, $fail) {
                    $grade = Grade::where('Code', $value)->where('Id', '!=', request()->grade)->first();

                    if (!is_null($grade)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'detail.createRow.*.criteriaId' => 'nullable|exists:Criterias,Id',
            'detail.createRow.*.rank' => 'nullable|in:' . implode(',', array_keys(GradeDetail::LEVEL)),
            'detail.updateRow.*.criteriaId' => 'nullable|exists:Criterias,Id',
            'detail.updateRow.*.rank' => 'nullable|in:' . implode(',', array_keys(GradeDetail::LEVEL)),
            'detail.deleteRow' => 'array|exists:GradeDetails,Id'
        ];
    }
}
