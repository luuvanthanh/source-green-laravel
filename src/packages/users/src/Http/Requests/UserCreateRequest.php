<?php

namespace GGPHP\Users\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UserCreateRequest extends FormRequest
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
        $genderValues = implode(',', config('constants.GENDER_VALUES.COLLECTIONS'));
        $marriageStatus = implode(',', config('constants.MARRIAGE_STATUS.COLLECTIONS'));

        return [
            'email' => 'unique:employees,email',
            'full_name' => 'required|string',
            'birthday' => [
                'required', 'sometimes', 'date', 'date_format:Y-m-d',
                function ($attribute, $value, $fail) {
                    $now = Carbon::now()->format('Y-m-d');
                    if ($value < $now) {
                        return true;
                    }
                    return $fail('Trường phải là một ngày trước ngày hôm nay');
                },
            ],
            'gender' => 'required|sometimes|string|in:' . $genderValues,
            'marriage_status' => 'sometimes|string|in:' . $marriageStatus,
            'id_card' => 'sometimes|string|min:9',
            'date_of_issue_id_card' => 'sometimes|date|date_format:Y-m-d|after:birthday',
            'place_of_issue_id_card' => 'sometimes|string',
        ];
    }
}
