<?php

namespace GGPHP\PositionLevel\Http\Requests;

use Carbon\Carbon;
use GGPHP\PositionLevel\Models\PositionLevel;
use Illuminate\Foundation\Http\FormRequest;

class PositionLevelUpdateRequest extends FormRequest
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
            'start_date' => [
                'date', 'after:today',
                function ($attribute, $value, $fail) {
                    $now = Carbon::now();
                    $today = $now->toDateString();
                    $startDate = PositionLevel::find(request('id'))->start_date->toDateString();

                    if ($today >= $startDate) {
                        return $fail('Điều chuyển đã được áp dụng, không được sửa');
                    }
                },
            ],
        ];
    }
}
