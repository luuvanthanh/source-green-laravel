<?php

namespace GGPHP\Crm\Fee\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalculatorTuitionRequest extends FormRequest
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
            'class_type_id' => 'required|uuid|exists:class_types,id',
            'school_year_id' => 'required|uuid|exists:school_years,id',
            'day_admission' => 'required|date|date_format:Y-m-d',
            'details' => 'required|array',
            'details.*.id' => 'required|uuid|distinct',
            'details.*.fee_id' => 'required|uuid|exists:fees,id',
            'details.*.payment_form_id' => 'required|uuid|exists:payment_forms,id',
            'student' => 'required|in:new,old',
        ];
    }
}
