<?php

namespace GGPHP\YoungAttendance\Absent\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsentStudentExcelRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'schoolYearId' => 'required|check_exists:fee.SchoolYears,Id',
            'startDate' => [
                'required',
                'date',
                'date_format:Y-m-d'
            ],
            'endDate' => [
                'required',
                'date',
                'date_format:Y-m-d',
                'after_or_equal:startDate',
            ],
        ];
    }
}
