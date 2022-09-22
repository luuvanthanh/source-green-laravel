<?php

namespace GGPHP\Attendance\Http\Requests;

use Carbon\Carbon;
use GGPHP\Attendance\Models\Attendance;
use GGPHP\Fee\Models\SchoolYear;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AttendanceCreateRequest extends FormRequest
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
        return [
            'studentId' => 'required',
            'employeeId' => 'required',
            'date' => [
                'required',
                function ($attribute, $value, $fail) {
                    $now = Carbon::now('GMT+7')->format('Y-m-d');

                    if (Carbon::parse($value)->format('Y-m-d') !== $now) {
                        return $fail('Ngày điểm danh phải là ngày hiện tại!');
                    }

                    return true;
                },
            ],
            'status' => [
                'required',
                function ($attribute, $value, $fail) {
                    $studentId = request()->studentId;
                    $date = request()->date;

                    if ($value == 'ANNUAL_LEAVE') {
                        return $fail('Không được xin nghỉ có phép!');
                    }

                    if ($value == 'HAVE_OUT') {
                        $studentTransporter = request()->studentTransporter;

                        if (is_null($studentTransporter)) {
                            return $fail('Học sinh ra về phải có người đưa đón!');
                        }
                    }

                    // $attendance = Attendance::where('StudentId', $studentId)->where('Date', $date)->first();

                    // if (!is_null($attendance)) {

                    //     foreach (Attendance::STATUS as $key => $value) {
                    //         if ($value == $attendance->Status) {
                    //             $status = $key;
                    //         }
                    //     }

                    //     // if ($status == Attendance::STATUS['ANNUAL_LEAVE']) {
                    //     //     return $fail('Học sinh xin nghỉ phép không được cập nhật dữ liệu!');
                    //     // }

                    //     if ($status == Attendance::STATUS['HAVE_OUT']) {
                    //         return $fail('Học sinh đã ra về không được cập nhật dữ liệu!');
                    //     }
                    // }

                    return true;
                },
            ],
            'schoolYearId' => [
                'required',
                function ($attribute, $value, $fail) {
                    $attendance = Attendance::where('StudentId', $this->studentId)->where('Date', $this->date)->first();

                    if (!is_null($attendance) && !is_null($attendance->SchoolYearId) && $attendance->SchoolYearId != $value) {
                        return $fail('Thời điểm hiện tại không trùng khớp năm học cấu hình.');
                    }

                    return true;
                },
            ]
        ];
    }

    /**
     * all
     *
     * @param  mixed $keys
     * @return void
     */
    public function all($keys = null)
    {
        $data = Parent::all();
        $schoolYear = SchoolYear::where('IsCheck', true)->first();

        $data['schoolYearId'] = !is_null($schoolYear) ? $schoolYear->Id : null;

        return $data;
    }

    public function messages()
    {
        return [
            'schoolYearId.required'  => 'Thời điểm hiện tại không thuộc bất kỳ năm học nào.',
        ];
    }
}
