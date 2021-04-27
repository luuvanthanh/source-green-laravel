<?php

namespace GGPHP\YoungAttendance\Absent\Http\Requests;

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
                'absentTypeId' => 'required|exists:AbsentTypes,Id',
                'absentReasonId' => 'required|exists:AbsentReason,Id',
                'parentId' => 'required|exists:Parents,Id',
                'startDate' => 'date|date_format:Y-m-d',
                'endDate' => 'date|date_format:Y-m-d|after_or_equal:startDate',
            ];
        }
    }
}
