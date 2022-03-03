<?php

namespace GGPHP\Crm\Fee\Http\Requests;

use GGPHP\Crm\Fee\Models\ChargeStudent;
use Illuminate\Foundation\Http\FormRequest;

class UpdateChargeStudentRequest extends FormRequest
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
            'student_info_id' => [
                'required_if:name_student,null',
                'uuid',
                'exists:student_infos,id',
                function ($attribute, $value, $fail) {
                    $chargeStudent = ChargeStudent::where([['school_year_id', $this->school_year_id], ['student_info_id', $value]])
                        ->where('id', '!=', $this->route('charge_student'))->first();
                    if (!is_null($chargeStudent)) {
                        return $fail('Học sinh chỉ có thể tạo được một lần cho một năm học.');
                    }
                }
            ],
            'name_student' => 'required_if:student_info_id,null|string',
            'day_admission' => 'required|date|date_format:Y-m-d',
            'class_type_id' => 'required|uuid|exists:class_types,id',
            'school_year_id' => 'required|uuid|exists:school_years,id',
            'tuition' => 'required|array',
            'tuition.*.fee_id' => 'required|uuid|exists:fees,id',
            'tuition.*.payment_form_id' => 'required|uuid|exists:payment_forms,id',
            'tuition.*.money' => 'required|numeric',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $chargeStudent = ChargeStudent::findOrFail($this->route('charge_student'));

        if (!is_null($chargeStudent->student_info_id)) {
            unset($data['name_student']);
            unset($data['date_of_birth']);
            unset($data['age']);
            unset($data['father_name']);
            unset($data['father_phone']);
            unset($data['mother_name']);
            unset($data['mother_phone']);
        }

        return $data;
    }
}
