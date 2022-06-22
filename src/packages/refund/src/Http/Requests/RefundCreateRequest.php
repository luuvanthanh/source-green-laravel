<?php

namespace GGPHP\Refund\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RefundCreateRequest extends FormRequest
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
            'schoolYearId' => 'required|uuid|check_exists:fee.SchoolYears,Id',
            'createRefundDetailRows' => 'nullable|array',
            'createRefundDetailRows.*.feeId' => 'required_with:createRefundDetailRows.*.configRefund|uuid|check_exists:fee.Fees,Id',
            'createRefundDetailRows.*.configRefund' => 'required_with:createRefundDetailRows.*.feeId',
            'createRefundDetailRows.*.configRefund.*.refundForm' => 'required_with:createRefundDetailRows.*.configRefund.*.type',
            'createRefundDetailRows.*.configRefund.*.type' => 'required_with:createRefundDetailRows.*.configRefund.*.refundForm|in:STORE,LEAVE',
            'createRefundDetailRows.*.startDate' => 'required_with:createRefundDetailRows.*.feeId|date|date_format:Y-m-d|before:createRefundDetailRows.*.endDate',
            'createRefundDetailRows.*.endDate' => 'required_with:createRefundDetailRows.*.startDate|date|date_format:Y-m-d|after:createRefundDetailRows.*.startDate',
        ];
    }
}
