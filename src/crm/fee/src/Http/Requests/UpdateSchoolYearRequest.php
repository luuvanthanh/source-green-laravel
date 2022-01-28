<?php

namespace GGPHP\Crm\Fee\Http\Requests;

use Carbon\Carbon;
use GGPHP\Crm\Fee\Models\SchoolYear;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSchoolYearRequest extends FormRequest
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
            'year_from' => [
                'required',
                function ($attribute, $value, $fail) {
                    $schoolYear = SchoolYear::where('year_from', $value)->first();

                    if (!is_null($schoolYear)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'year_to' => [
                'required',
                function ($attribute, $value, $fail) {
                    $schoolYear = SchoolYear::where('year_to', $value)->first();

                    if (!is_null($schoolYear)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'start_date' => [
                'required',
                function ($attribute, $value, $fail) {
                    $yearFrom = Carbon::now()->setTimezone('GMT+7')->setYear(request()->year_from)->setDay(1)->setMonth(1);
                    $yearTo = Carbon::now()->setTimezone('GMT+7')->setYear(request()->year_to)->setDay(31)->setMonth(12);
                    $startDate = Carbon::parse($value);

                    if ($startDate < $yearFrom || $startDate > $yearTo) {
                        return $fail('Thời gian bắt đầu phải nằm trong từ năm đến năm.');
                    }
                },
            ],
            'end_date' => [
                'required',
                function ($attribute, $value, $fail) {
                    $yearFrom = Carbon::now()->setTimezone('GMT+7')->setYear(request()->year_from)->setDay(1)->setMonth(1);
                    $yearTo = Carbon::now()->setTimezone('GMT+7')->setYear(request()->year_to)->setDay(31)->setMonth(12);

                    $startDate = Carbon::parse(request()->startDate);
                    $endDate = Carbon::parse($value);

                    if ($endDate <= $startDate) {
                        return $fail('Thời gian kết thúc phải lớn hơn thời gian bắt đầu.');
                    }

                    if ($endDate < $yearFrom || $endDate > $yearTo) {
                        return $fail('Thời gian kết thúc phải nằm trong từ năm đến năm.');
                    }
                },
            ],
        ];
    }
}
