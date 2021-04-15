<?php

namespace GGPHP\Dismissed\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DismissedCreateRequest extends FormRequest
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
            'decision_number' => 'unique:dismisseds,decision_number',
            'decision_date' => 'required',
            'reason' => 'required',
            'data' => 'required|array',
            'data.*.employee_id' => 'required',
            'data.*.branch_id' => 'required',
            'data.*.division_id' => 'required',
            'data.*.position_id' => 'required',
            'data.*.note' => 'required',
        ];
    }
}
