<?php

namespace GGPHP\DecisionNumberSample\Http\Requests;

use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use Illuminate\Foundation\Http\FormRequest;

class DecisionNumberSampleCreateRequest extends FormRequest
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
        $types = implode(',', array_values(DecisionNumberSample::TYPE));

        return [
            'ordinalNumber' => 'required|string',
            'type' => 'required|in:' . $types,
            'numberForm' => 'required|unique:DecisionNumberSamples,NumberForm',
            'startDate' => [
                'required',
                'date',
                'date_format:Y-m-d',
                'before_or_equal:endDate',
                function ($attribute, $value, $fail) {
                    $check = DecisionNumberSample::where('Type', $this->type)->where(function ($query) use ($value) {
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
                    })->get();

                    if ($check->isEmpty()) {
                        return true;
                    }

                    return $fail('Thời gian hiệu lực trùng.');;
                }
            ],
            'endDate' => 'required|date_format:Y-m-d|after_or_equal:startDate',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        $data['type'] = array_key_exists($data['type'], DecisionNumberSample::TYPE) ? DecisionNumberSample::TYPE[$data['type']] : 0;

        return $data;
    }
}
