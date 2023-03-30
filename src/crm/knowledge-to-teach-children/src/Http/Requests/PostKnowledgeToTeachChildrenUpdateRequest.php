<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests;

use GGPHP\Crm\KnowledgeToTeachChildren\Models\PostKnowledgeToTeachChildren;
use Illuminate\Foundation\Http\FormRequest;

class PostKnowledgeToTeachChildrenUpdateRequest extends FormRequest
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
            'name' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    $knowledgeToTeachChildren = PostKnowledgeToTeachChildren::where('id', '!=', $this->id)->where('name', $value)->first();

                    if (is_null($knowledgeToTeachChildren)) {
                        return true;
                    }

                    return $fail('Dữ liệu đã có trong hệ thống');
                },
            ],
            'category_knowledge_to_teach_children_id' => 'nullable',
            'status' => 'nullable|in:'. $status,
            'employee_id' => 'nullable|check_exists:hrm.Employees,Id'
        ];
    }

    public function all($key = null)
    {
        $data = parent::all();
        $data['status'] = array_key_exists($data['status'], PostKnowledgeToTeachChildren::STATUS) ? PostKnowledgeToTeachChildren::STATUS[$data['status']] : 0;

        return $data;
    }
}
