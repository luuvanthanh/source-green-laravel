<?php

namespace GGPHP\Crm\Fee\Http\Requests;

use Carbon\Carbon;
use GGPHP\Crm\Fee\Models\SchoolYear;
use Illuminate\Foundation\Http\FormRequest;

class UpdateClassTypeRequest extends FormRequest
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
}
