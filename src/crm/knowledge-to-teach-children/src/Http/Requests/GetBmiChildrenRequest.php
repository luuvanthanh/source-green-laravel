<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests;

use GGPHP\Crm\KnowledgeToTeachChildren\Models\PostKnowledgeToTeachChildren;
use Illuminate\Foundation\Http\FormRequest;

class GetBmiChildrenRequest extends FormRequest
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
            'height' => 'required|numeric',
            'weight' => 'required|numeric',
            'number_of_month' => 'required|integer',
            'gender' => 'required|in:MALE,FEMALE'
        ];
    }

    public function messages()
    {
        return [
            'height.numeric' => 'Trường :attribute phải là một số',
            'weight.numeric' => 'Trường :attribute phải là một số' 
        ];
    }
}
