<?php

namespace GGPHP\Refund\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RefundStudentCreateRequest extends FormRequest
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
            'branchId' => 'required|exists:Branches,Id',
            'refundId' => 'required|check_exists:fee.Refunds,Id',
            'month' => 'required|date_format:Y-m|check_unique:fee.RefundStudents,Month',
            'type' => 'required|in:LEAVE,STORE',
            'listStudent' => 'required|array',
            'listStudent.*.StudentId' => 'required|check_exists:object.Students,Id',
            'listStudent.*.refund' => 'required|array',
            'listStudent.*.refund.*.feeId' => 'required|check_exists:fee.Fees,Id',
            'listStudent.*.refund.*.dateOff' => 'nullable|date',
            'listStudent.*.refund.*.numberDayOff' => 'nullable|integer',
            'listStudent.*.refund.*.feeRefund' => 'required|numeric',
            'listStudent.*.refund.*.feePaid' => 'required|numeric',
            'listStudent.*.refund.*.feeStudied' => 'required|numeric',
        ];
    }
}
