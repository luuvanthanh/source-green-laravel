<?php

namespace GGPHP\MagneticCard\Http\Requests;

use GGPHP\MagneticCard\Models\MagneticCard;
use GGPHP\Users\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class MagneticCardCreateRequest extends FormRequest
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
            'employeeId' => 'required|exists:Employees,Id',
            'card' => ['required', 'numeric', function ($attribute, $value, $fail) {

                $value = (int) $value;
                $middle = floor(strlen($value) / 2);
                $magneticCard = substr($value, 0, $middle);
                $magneticCardPatch = substr($value, $middle);

                $unique = MagneticCard::where(['MagneticCard' => (int) $magneticCard, 'MagneticCardPatch' => $magneticCardPatch])->first();
                if ($unique) {
                    return $fail('Mã thẻ đã tồn tại trong hệ thống.');
                }

                $user = MagneticCard::where('EmployeeId', request()->employeeId)->first();

                if ($user) {
                    return $fail('Người dùng đã có thẻ.');
                }

                $lenght = strlen($value);
                if ($lenght > 50) {
                    return $fail('Giá trị nhập vào không được lớn hơn 50 ký tự.');
                }
                return true;
            }],
        ];
    }
}
