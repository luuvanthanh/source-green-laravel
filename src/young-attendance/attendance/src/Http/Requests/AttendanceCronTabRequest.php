<?php

namespace GGPHP\Attendance\Http\Requests;

use GGPHP\Fee\Models\SchoolYear;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class AttendanceCronTabRequest extends FormRequest
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
    public function rules(Request $request)
    {
        return [];
    }

    public function all($keys = null)
    {
        $data = parent::all();
        $data['schoolYearId'] = null;
        $schoolYear = SchoolYear::where('IsCheck', true)->first();

        if (!is_null($schoolYear)) {
            $data['schoolYearId'] = $schoolYear->Id;
        }

        return $data;
    }
}
