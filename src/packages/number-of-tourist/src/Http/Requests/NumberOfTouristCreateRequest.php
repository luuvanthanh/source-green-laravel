<?php

namespace GGPHP\NumberOfTourist\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NumberOfTouristCreateRequest extends FormRequest
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
            'camera_id' =>  'required|uuid|exists:cameras,id',
            'time' =>  'required',
            'number_of_guest_in' =>  'required',
            'number_of_guest_out' =>  'required',
        ];
    }
}
