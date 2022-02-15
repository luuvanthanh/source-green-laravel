<?php

namespace GGPHP\ShiftSchedule\Http\Requests;

use Carbon\Carbon;
use GGPHP\ShiftSchedule\Models\DivisionShift;
use Illuminate\Foundation\Http\FormRequest;

class DivisionShiftUpdateRequest extends FormRequest
{
    /**
     * Determine if the employee is authorized to make this request.
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
            'startDate' => [
                'date',
                function ($attribute, $value, $fail) {
                    $id = request()->id;
                    $divisionId = request()->divisionId;
                    $shift = DivisionShift::where('DivisionId', $divisionId)->whereNotIn('Id', [$id])->orderBy('CreationTime', 'DESC')->first();
                    if (!is_null($shift) && $value <= $shift->StartDate->format('Y-m-d')) {
                        return $fail('Thời gian bắt đầu phải lớn hơn ' . $shift->StartDate->format('d-m-Y'));
                    }

                    $now = Carbon::now();
                    $today = $now->toDateString();
                    $startDate = DivisionShift::find(request('id'))->StartDate->toDateString();

                    if ($today >= $startDate) {
                        return $fail('Phân ca đã được áp dụng, vui lòng tạo phân ca mới, không được sửa');
                    }
                },
            ],
            'endDate' => [
                'date', 'after:startDate',
            ],
        ];
    }
}
