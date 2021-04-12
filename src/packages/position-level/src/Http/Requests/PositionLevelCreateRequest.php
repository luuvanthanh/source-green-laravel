<?php

namespace GGPHP\PositionLevel\Http\Requests;

use Carbon\Carbon;
use GGPHP\PositionLevel\Models\PositionLevel;
use Illuminate\Foundation\Http\FormRequest;

class PositionLevelCreateRequest extends FormRequest
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
            'employee_id' => 'required',
            'position_id' => 'required',
            'division_id' => 'required',
            'branch_id' => 'required',
            'start_date' => [
                'required',
                'date',
                'after:today',
                function ($attribute, $value, $fail) {
                    $now = Carbon::now();
                    $today = $now->toDateString();
                    $userId = request()->user_id;

                    $tranfer = PositionLevel::where('user_id', $userId)->where('start_date', '>', $today)->first();

                    if (!is_null($tranfer)) {
                        return $fail('Bạn đã tạo điều chuyển, vui lòng xem lại.');
                    }
                },
            ],
        ];
    }
}
