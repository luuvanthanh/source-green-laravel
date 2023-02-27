<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryKnowledgeToTeachChildrenCreateRequest extends FormRequest
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
            'name' => 'required|string|unique:category_knowledge_to_teach_childrens,name',
        ];
    }
}
