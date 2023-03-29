<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Http\Requests;

use GGPHP\Crm\KnowledgeToTeachChildren\Models\PostKnowledgeToTeachChildren;
use Illuminate\Foundation\Http\FormRequest;

class CategoryKnowledgeToTeachChildrenGetRequest extends FormRequest
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
        $status = implode(',', array_values(PostKnowledgeToTeachChildren::STATUS));

        return [
            'status' => 'nullable|in:' . $status,
        ];
    }

    public function all($key = null)
    {
        $data = parent::all();

        if (!empty($data['status'])) {
            $data['status'] = array_key_exists($data['status'], PostKnowledgeToTeachChildren::STATUS) ? PostKnowledgeToTeachChildren::STATUS[$data['status']] : 0;
        }

        return $data;
    }
}
