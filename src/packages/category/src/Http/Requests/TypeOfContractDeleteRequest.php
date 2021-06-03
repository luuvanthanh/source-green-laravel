<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class TypeOfContractDeleteRequest extends FormRequest
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
    public function rules(Request $request)
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
    private function checkAccessDelete($typeOfContractId)
    {
        $labourContract = LabourContract::where('TypeOfContractId', $typeOfContractId)->get();
        $probationaryContract = ProbationaryContract::where('TypeOfContractId', $typeOfContractId)->get();

        if (count($labourContract) > 0 || count($probationaryContract) > 0) {
            return false;
        }

        return true;
    }
}
