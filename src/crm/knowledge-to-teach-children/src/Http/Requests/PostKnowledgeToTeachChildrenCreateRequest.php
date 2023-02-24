<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests;

use GGPHP\Crm\Employee\Models\Employee;
use GGPHP\Crm\KnowledgeToTeachChildren\Models\PostKnowledgeToTeachChildren;
use Illuminate\Foundation\Http\FormRequest;

class PostKnowledgeToTeachChildrenCreateRequest extends FormRequest
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
        $status = implode(',',array_values(PostKnowledgeToTeachChildren::STATUS));
        
        return [
            'name' => 'required|string|unique:post_knowledge_to_teach_childrens,name',
            'category_knowledge_to_teach_children_id' => 'required',
            'status' => 'required|in:'. $status,
            'employee_id' => 'required|exists:employees,employee_id_hrm'
        ];
    }

    public function all($key = null)
    {
        $data = parent::all();
        $data['status'] = array_key_exists($data['status'], PostKnowledgeToTeachChildren::STATUS) ? PostKnowledgeToTeachChildren::STATUS[$data['status']] : 0;

        return $data;
    }
}
