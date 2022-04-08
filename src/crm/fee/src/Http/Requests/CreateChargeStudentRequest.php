<?php

namespace GGPHP\Crm\Fee\Http\Requests;

use GGPHP\Crm\Fee\Models\ChargeStudent;
use Illuminate\Foundation\Http\FormRequest;

class CreateChargeStudentRequest extends FormRequest
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
                'required_without:name_student',
                'uuid',
                'exists:admission_registers,student_info_id',
                'exists:student_infos,id',
                // function ($attribute, $value, $fail) {
                //     $chargeStudent = ChargeStudent::where('school_year_id', $this->school_year_id)->where('student_info_id', $value)->first();

                //     if (!is_null($chargeStudent)) {
                //         return $fail('Học sinh chỉ có thể tạo được một lần cho một năm học.');
                //     }
                // }
            ],
            'name_student' => 'required_without:student_info_id|string',
            'day_admission' => 'required|date|date_format:Y-m-d',
            'class_type_id' => 'required|uuid|exists:class_types,id',
            'school_year_id' => 'required|uuid|exists:school_years,id',
            'tuition' => 'required|array',
            'tuition.*.fee_id' => 'required|uuid|exists:fees,id',
            'tuition.*.payment_form_id' => 'required|uuid|exists:payment_forms,id',
            'tuition.*.money' => 'required|numeric',
            'expected_to_collect_money' => 'required|array'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        unset($data['details.*.id']);

        if (!empty($data['student_info_id'])) {
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
