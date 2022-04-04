<?php

namespace GGPHP\Fee\Http\Requests;

use GGPHP\Fee\Models\ChargeOldStudent;
use Illuminate\Foundation\Http\FormRequest;

class CreateChargeOldStudentRequest extends FormRequest
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
                    $chargeOldStudent = ChargeOldStudent::where('StudentId', $value)->where('SchoolYearId', request()->schoolYearId)->first();

                    if (!is_null($chargeOldStudent)) {
                        return $fail('Học sinh chỉ có thể tạo được một lần cho một năm học.');
                    }
                },
            ],
        ];
    }
}
