<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\TypeOfContract;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;

use function Clue\StreamFilter\fun;

class ParamaterValueDeleteRequest extends FormRequest
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $labourContract = LabourContract::whereHas('parameterValues', function ($query) use ($value) {
                        $query->where('ParameterValueId', $value);
                    })->first();

                    $probationaryContract = ProbationaryContract::whereHas('parameterValues', function ($query) use ($value) {
                        $query->where('ParameterValueId', $value);
                    })->first();

                    $typeOfContract = TypeOfContract::whereHas('parameterValues', function ($query) use ($value) {
                        $query->where('ParameterValueId', $value);
                    })->first();

                    if (!is_null($labourContract) || !is_null($probationaryContract) || !is_null($typeOfContract)) {
                        return $fail('Dữ liệu đang được sử dụng!');
                    }
                },
            ],
        ];
    }
}
