<?php

namespace GGPHP\Fee\Http\Requests;

use GGPHP\Fee\Models\ChargeStudent;
use Illuminate\Foundation\Http\FormRequest;

class CreateChargeStudentRequest extends FormRequest
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
            'nameStudent' => [
                function ($attribute, $value, $fail) {
                    $chargeStudent = ChargeStudent::where('Id', request()->chargeStudentId)->where('SchoolYearId', request()->schoolYearId)->first();

                    if (!is_null($chargeStudent)) {
                        return $fail('Học sinh chỉ có thể tạo được một lần cho một năm học.');
                    }
                },
            ],
        ];
    }
}
