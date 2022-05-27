<?php

namespace GGPHP\Fee\Http\Requests;

use GGPHP\Clover\Models\Classes;
use GGPHP\Fee\Models\ChargeOldStudent;
use Illuminate\Foundation\Http\FormRequest;

class UpdateChargeOldStudentRequest extends FormRequest
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
            'schoolYearId' => 'required',
            'studentId' => [
                'required',
                function ($attribute, $value, $fail) {
                    $chargeOldStudent = ChargeOldStudent::where('StudentId', $value)->where('SchoolYearId', request()->schoolYearId)
                        ->where('ClassTypeId', '!=', $this->classTypeId)->first();

                    if (!is_null($chargeOldStudent)) {
                        return $fail('Học sinh đã được tính phí theo cở sở này trong năm.');
                    }
                },
            ],
            'branchId' => 'required',
            'classTypeId' => 'required',
            'classId' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    $class = Classes::find($value);

                    if (!is_null($class)) {
                        return true;
                    }

                    return $fail('Giá trị đã chọn trong trường không hợp lệ.');
                }
            ]
        ];
    }
}
