<?php

namespace GGPHP\InOutHistories\Http\Requests;

use GGPHP\Fee\Models\SchoolYear;
use Illuminate\Foundation\Http\FormRequest;

class CreatInOutHistoriesRequest extends FormRequest
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
            'studentId' => 'required',
            'attendedAt' => 'required',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all();
        $schoolYear = SchoolYear::where('IsCheck', true)->first();

        if (!is_null($schoolYear)) {
            $data['schoolYearId'] = $schoolYear->Id;
        }

        return $data;
    }
}
