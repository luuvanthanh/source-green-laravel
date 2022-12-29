<?php

namespace GGPHP\Profile\Http\Requests;

use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\NumberFormContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Profile\Models\SeasonalContract;
use Illuminate\Foundation\Http\FormRequest;

class NumberFormContractUpdateRequest extends FormRequest
{
    const LABOUR = 1;
    const PROBATIONARY = 2;
    const SEASONAL = 3;

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
        $id = $this->route('number_form_contract');
        $types = implode(',', array_values(NumberFormContract::TYPE));

        return [
            'ordinalNumber' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) use ($id) {
                    $model = NumberFormContract::findOrfail($id);

                    if ($value >= $model->OrdinalNumber) {
                        return true;
                    }

                    return $fail('Số thứ tự phải lớn hơn số đã có.');
                }
            ],
            'type' => 'nullable|in:' . $types,
            'numberForm' => [
                'nullable',
                function ($attribute, $value, $fail) use ($id) {
                    $contracts = NumberFormContract::where('Id', '!=', $id)->where('Type', $this->type)->where('NumberForm', $value)->get();

                    if ($contracts->isEmpty()) {
                        return true;
                    }

                    return $fail('Mẫu số  hợp đồng đã tồn tại.');
                },
                function ($attribute, $value, $fail) use ($id) {
                    $numberFormContract  = NumberFormContract::findOrFail($id);

                    if ($value != $numberFormContract->NumberForm) {
                        switch ($numberFormContract->Type) {
                            case self::LABOUR:
                                $contracts = LabourContract::where('NumberForm', $numberFormContract->NumberForm)->get();
                                break;
                            case self::PROBATIONARY:
                                $contracts = ProbationaryContract::where('NumberForm', $numberFormContract->NumberForm)->get();
                                break;
                            case self::SEASONAL:
                                $contracts = SeasonalContract::where('NumberForm', $numberFormContract->NumberForm)->get();
                                break;
                            default:
                                $contracts = collect();
                                break;
                        }

                        if ($contracts->isNotEmpty()) {
                            return $fail('Mẫu số đã áp dụng cho hợp đồng');
                        }

                        return true;
                    }

                    return true;
                }
            ],
            'startDate' => [
                'nullable',
                'date_format:Y-m-d',
                'before_or_equal:endDate',
                function ($attribute, $value, $fail) use ($id) {
                    $numberFormContracts = NumberFormContract::where('Type', $this->type)->where(function ($query) use ($value) {
                        $query->where([
                            ['StartDate', '<=', $value],
                            ['EndDate', '>=', $value]
                        ])->orWhere([
                            ['StartDate', '>=', $value],
                            ['EndDate', '<=', $this->endDate]
                        ])->orWhere([
                            ['StartDate', '>=', $value],
                            ['StartDate', '<=', $this->endDate]
                        ]);
                    })->where('Id', '!=', $id)->get();

                    if ($numberFormContracts->isEmpty()) {
                        return true;
                    }

                    return $fail('Thời gian hiệu lực trùng.');;
                }
            ],
            'endDate' => 'nullable|date_format:Y-m-d|after_or_equal:startDate',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        $data['type'] = array_key_exists($data['type'], NumberFormContract::TYPE) ? NumberFormContract::TYPE[$data['type']] : 0;

        return $data;
    }
}
