<?php

namespace GGPHP\Crm\Marketing\Http\Requests;

use GGPHP\Crm\Marketing\Models\PostFacebookInfo;
use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
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
            'marketing_program_id' => 'exists:marketing_programs,id',
            'data_page' => function ($attribute, $value, $fail) {
                $postFacebookInfo = PostFacebookInfo::where('article_id', $this->article)->first();

                if (!is_null($postFacebookInfo)) {
                    return $fail('Bài viết đã được đăng lên fanpage vui lòng login facebook trước khi cập nhật');
                }

                return true;
            },
        ];
    }
}
