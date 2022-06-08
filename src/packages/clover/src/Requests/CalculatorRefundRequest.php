<?php

namespace GGPHP\Clover\Requests;

use Carbon\Carbon;
use GGPHP\Refund\Models\Refund;
use Illuminate\Foundation\Http\FormRequest;

class CalculatorRefundRequest extends FormRequest
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
            'refundId' => 'required|check_exists:fee.Refunds,Id',
            'date' => [
                'required',
                'date_format:Y-m',
                function ($attribute, $value, $fail) {
                    $refund = Refund::find($this->refundId);
                    $schoolYear = $refund->schoolYear;

                    $startDate = Carbon::parse($schoolYear->StartDate)->format('Y-m');
                    $endDate = Carbon::parse($schoolYear->EndDate)->format('Y-m');

                    if (!Carbon::parse($value)->between($startDate, $endDate)) {
                        return $fail('Tháng được chọn không hợp thuộc năm học');
                    }
                }
            ]
        ];
    }
}
