<?php

namespace GGPHP\Category\Http\Requests;

use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\City;
use Illuminate\Foundation\Http\FormRequest;

class BranchCreateRequest extends FormRequest
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
            'name' => [
                'required', 'max:255',
                function ($attribute, $value, $fail) {
                    $branch = Branch::where('Name', $value)->first();

                    if (!is_null($branch)) {
                        return $fail('Trường đã có trong cơ sở dữ liệu!');
                    }
                },
            ],
            'note' => 'nullable|max:255',
            'cityId' => 'required|exists:Citys,Id'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $branch = Branch::latest()->first();
        $city = City::find($data['cityId']);

        if (is_null($branch)) {
            $data['code'] = $city->Code . '001';
        } else {
            $findNum = substr(substr($branch->Code, strpos($branch->Code, '-') + 1), 0, -1);
            $getNumber = substr($branch->Code, strpos($branch->Code, '-') + 1);

            if (++$getNumber <= 9) {
                $data['code'] = $city->Code . '-' . '00' . $getNumber;
            } else {
                $data['code'] = $city->Code . '-' . $getNumber;
            }
        }

        return $data;
    }
}
