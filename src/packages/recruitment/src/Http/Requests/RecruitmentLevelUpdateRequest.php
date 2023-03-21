<?php

namespace GGPHP\Recruitment\Http\Requests;

use GGPHP\Recruitment\Models\Level;
use GGPHP\Recruitment\Models\RecruitmentLevel;
use Illuminate\Foundation\Http\FormRequest;

class RecruitmentLevelUpdateRequest extends FormRequest
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
            'id' => 'required',
            'name' => [
                'nullable', 'string',
                function ($attribute, $value, $fail) {
                    $level = RecruitmentLevel::where('Name', $value)->where('Id', '!=', $this->id)->first();

                    if (is_null($level)) {
                        return true;
                    }

                    return $fail('Dữ liệu đã có trong hệ thống');
                },
            ],
            'decription' => 'nullable|string',
        ];
    }
}
