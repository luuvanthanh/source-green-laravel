<?php

namespace GGPHP\Fee\Http\Requests;

use GGPHP\Fee\Models\FeePolicie;
use Illuminate\Foundation\Http\FormRequest;

class CreateFeePolicieRequest extends FormRequest
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
            ],
            'branchId' => [
                'required',
                function ($attribute, $value, $fail) {
                    $feePolicie = FeePolicie::where('SchoolYearId', $this->schoolYearId)->where('BranchId', $value)->first();

                    if (!is_null($feePolicie)) {
                        return $fail('Một cơ sở chỉ có thể tạo được một năm học.');
                    }
                },
            ],
        ];
    }
}
