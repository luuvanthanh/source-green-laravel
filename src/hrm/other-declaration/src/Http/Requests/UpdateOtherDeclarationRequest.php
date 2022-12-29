<?php

namespace GGPHP\OtherDeclaration\Http\Requests;

use GGPHP\OtherDeclaration\Models\OtherDeclaration;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOtherDeclarationRequest extends FormRequest
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
            'time' => [
                function ($attribute, $value, $fail) {
                    $otherDeclaration = OtherDeclaration::where('Id', '!=', $this->route('id'))->where('Time', $value)->first();

                    if (!is_null($otherDeclaration)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu');
                    }
                },
            ],
            'startDate' => [
                'nullable',
                'date',
                'date_format:Y-m-d',
                'before:endDate',
                function ($attribute, $value, $fail) {
                    $otherDeclaration = OtherDeclaration::whereDate('StartDate', '>=', $value)->whereDate('EndDate', '<=', $value)
                        ->where('Id', '!=', $this->route('id'))->first();

                    if (!is_null($otherDeclaration)) {
                        return $fail('Khoảng thời gian đã có trong hệ thống');
                    }
                }
            ],
            'endDate' => [
                'nullable',
                'date',
                'date_format:Y-m-d',
                'after:startDate',
                function ($attribute, $value, $fail) {
                    $otherDeclaration = OtherDeclaration::whereDate('StartDate', '<=', $value)->whereDate('EndDate', '>=', $value)
                        ->where('Id', '!=', $this->route('id'))->first();

                    if (!is_null($otherDeclaration)) {
                        return $fail('Khoảng thời gian đã có trong hệ thống');
                    }
                }
            ]
        ];
    }
}
