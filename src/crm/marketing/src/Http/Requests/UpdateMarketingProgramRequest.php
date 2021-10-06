<?php

namespace GGPHP\Crm\Marketing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMarketingProgramRequest extends FormRequest
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
            'name' => 'string',
            'start_date' => 'after_or_equal:today|date_format:Y-m-d',
            'end_date' => 'date_format:Y-m-d|after:start_date',
            'content' => 'string',
            'note' => 'string',
        ];
    }
}
