<?php

namespace GGPHP\YoungAttendance\Absent\Http\Requests;

use Carbon\Carbon;
use GGPHP\YoungAttendance\Absent\Models\Absent;
use Illuminate\Foundation\Http\FormRequest;

class AbsentDeleteRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            'id' => [
                'required',
                function ($attribute, $value, $fail) {

                    $absent = Absent::findOrFail($value);
                    $now = Carbon::now();

                    if ($absent->StartDate->format('Y-m-d') < $now->format('Y-m-d')) {
                        return $fail("Không được xóa dữ liệu trong quá khứ!");
                    }

                    return true;
                },
            ],
        ];
    }
}
