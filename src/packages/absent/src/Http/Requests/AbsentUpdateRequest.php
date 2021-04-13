<?php

namespace GGPHP\Absent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsentUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $absentStatus = implode(',', config('constants-absent.ABSENT'));

        if (request()->status) {
            return [
                'status' => 'required|string|in:' . $absentStatus,
            ];
        } else {
            return [
                'absent_type_id' => 'required|exists:absent_types,id',
                'absent_reason_id' => 'required|exists:absent_reasons,id',
                'user_id' => 'required|exists:employees,id',
                'store_id' => 'required|exists:stores,id',
                'start_date' => 'date|date_format:Y-m-d',
                'end_date' => 'date|date_format:Y-m-d|after_or_equal:start_date',
            ];
        }
    }
}
