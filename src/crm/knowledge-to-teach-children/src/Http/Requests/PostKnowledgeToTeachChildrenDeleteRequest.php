<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostKnowledgeToTeachChildrenDeleteRequest extends FormRequest
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
            'id' => [
                'required',
                function ($attribute, $value, $fail) {
                    // $knowledgeToTeachChildren = CategoryPost::where('name', $value)->where('id', '!=', $this->id)->first();

                    // if (is_null($knowledgeToTeachChildren)) {
                    //     return true;
                    // }

                    // return $fail('Dữ liệu đã có trong hệ thống');
                },
            ],
        ];
    }
}
