<?php

namespace GGPHP\Absent\Http\Requests;

use GGPHP\Absent\Models\Absent;
use GGPHP\BusinessCard\Models\BusinessCard;
use GGPHP\WorkHour\Models\WorkHour;
use Illuminate\Foundation\Http\FormRequest;

class AbsentTypeDeleteRequest extends FormRequest
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
                    $accessUpdate = $this->checkAccessDelete($value);

                    if ($accessUpdate) {
                        return true;
                    }
                    return $fail('Dữ liệu đang được sử dụng');
                },
            ],
        ];
    }

    /**
     * Check shift is access delete
     *
     * @return boolean
     */
    private function checkAccessDelete($id)
    {
        $absent = Absent::where('AbsentTypeId', $id)->first();
        $businessCard = BusinessCard::where('AbsentTypeId', $id)->first();
        $workHour = WorkHour::where('AbsentTypeId', $id)->first();

        if (is_null($absent) && is_null($businessCard) && is_null($workHour)) {
            return true;
        }

        return false;
    }
}
