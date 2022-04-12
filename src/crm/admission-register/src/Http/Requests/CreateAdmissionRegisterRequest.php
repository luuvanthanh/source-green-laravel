<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Requests;

use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use Illuminate\Foundation\Http\FormRequest;

class CreateAdmissionRegisterRequest extends FormRequest
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
            'customer_lead_id' => 'exists:customer_leads,id',
            'student_info_id' => [
                'required',
                'exists:student_infos,id',
                function ($attribute, $value, $fail) {
                    $studentInfo = ParentInfo::where('customer_lead_id', request()->customer_lead_id)->whereHas('admissionRegister', function ($q) use ($value) {
                        $q->where('student_info_id', $value);
                    })->first();

                    $admissionRegister = AdmissionRegister::where('student_info_id', $value)->where('status', true)->first();

                    if (is_null($studentInfo)) {
                        return true;
                    } elseif (!is_null($admissionRegister)) {
                        return true;
                    } else {
                        return $fail('Một học sinh chỉ được đăng ký một lần');
                    }
                },
            ],
            'date_register' => 'required|date_format:Y-m-d',
            'parent_wish' => 'string',
            'children_note' => 'string'
        ];
    }
}
