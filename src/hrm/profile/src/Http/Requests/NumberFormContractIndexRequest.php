<?php

namespace GGPHP\Profile\Http\Requests;

use GGPHP\Profile\Models\NumberFormContract;
use Illuminate\Foundation\Http\FormRequest;

class NumberFormContractIndexRequest extends FormRequest
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
        return [];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);

        if (!empty($data['type'])) {
            $data['type'] = array_key_exists($data['type'], NumberFormContract::TYPE) ? NumberFormContract::TYPE[$data['type']] : 'Empty';
        }

        return $data;
    }
}
