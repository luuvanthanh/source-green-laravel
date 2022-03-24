<?php

namespace GGPHP\Crm\CallCenter\Http\Requests;

use GGPHP\Crm\CallCenter\Models\ManagerCall;
use Illuminate\Foundation\Http\FormRequest;

class CreateManagerCallRequest extends FormRequest
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
            'employee_id' => 'required|exists:employees,id',
            'expected_date' => 'required|date|date_format:Y-m-d|afterOrEqual:receive_date',
            'receive_date' => 'required|date|date_format:Y-m-d|date_equals:' . now()->toDateString(),
            'content' => 'required|string',
            'call_times' => 'required|in:FIRST,SECOND,THIRTH,FOURTH,FIVETH',
            'list_customer_lead' => 'required|array',
            'list_customer_lead.*.customer_lead_id' => [
                'required',
                'exists:customer_leads,id',
                'distinct',
                function ($attribute, $value, $fail) {
                    $check = ManagerCall::where('customer_lead_id', $value)
                        ->where('call_times', ManagerCall::CALLTIME[$this->call_times])->first();

                    if (!is_null($check)) {
                        return $fail('Đối tượng :attribute đã được lên lịch gọi thứ ' . ManagerCall::CALLTIME[$this->call_times]);
                    }

                    return true;
                }
            ]
        ];
    }
}
