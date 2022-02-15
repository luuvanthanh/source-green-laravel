<?php

namespace GGPHP\Fee\Http\Requests;

use Carbon\Carbon;
use GGPHP\Fee\Models\SchoolYear;
use Illuminate\Foundation\Http\FormRequest;

class CreateSchoolYearRequest extends FormRequest
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
            'yearFrom' => [
                'required',
                function ($attribute, $value, $fail) {
                    $schoolYear = SchoolYear::where('YearFrom', $value)->first();

                    if (!is_null($schoolYear)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'yearTo' => [
                'required',
                function ($attribute, $value, $fail) {
                    $schoolYear = SchoolYear::where('YearTo', $value)->first();

                    if (!is_null($schoolYear)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu.');
                    }
                },
            ],
            'startDate' => [
                'required',
                function ($attribute, $value, $fail) {
                    $yearFrom = Carbon::now()->setTimezone('GMT+7')->setYear(request()->yearFrom)->setDay(1)->setMonth(1);
                    $yearTo = Carbon::now()->setTimezone('GMT+7')->setYear(request()->yearTo)->setDay(31)->setMonth(12);

                    $startDate = Carbon::parse($value);

                    if ($startDate < $yearFrom || $startDate > $yearTo) {
                        return $fail('Thời gian bắt đầu phải nằm trong từ năm đến năm.');
                    }
                },
            ],
            'endDate' => [
                'required',
                function ($attribute, $value, $fail) {
                    $yearFrom = Carbon::now()->setTimezone('GMT+7')->setYear(request()->yearFrom)->setDay(1)->setMonth(1);
                    $yearTo = Carbon::now()->setTimezone('GMT+7')->setYear(request()->yearTo)->setDay(31)->setMonth(12);

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
