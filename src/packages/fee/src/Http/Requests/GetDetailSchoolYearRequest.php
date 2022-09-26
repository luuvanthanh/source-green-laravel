<?php

namespace GGPHP\Fee\Http\Requests;

use GGPHP\Fee\Models\SchoolYear;
use Illuminate\Foundation\Http\FormRequest;

class GetDetailSchoolYearRequest extends FormRequest
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
            'schoolYearId' => [
                'required',
                function ($attribute, $value, $fail) {

                    $schoolYear = SchoolYear::find($value);

                    if ($schoolYear->fixedParameter->isEmpty()) {
                        return $fail('Tham số cố định chưa được cấu hình.');
                    }

                    if (!$schoolYear->changeParameter) {
                        return $fail('Tham số thay đổi theo thời điểm chư được cấu hình.');
                    }

                    return true;
                },
            ],
        ];
    }
}
