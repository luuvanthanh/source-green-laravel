<?php

namespace GGPHP\Crm\Marketing\Http\Requests;

use GGPHP\Crm\Marketing\Models\Article;
use GGPHP\Crm\Marketing\Models\MarketingProgram;
use GGPHP\Crm\Marketing\Models\PostFacebookInfo;
use Illuminate\Foundation\Http\FormRequest;

class PostArticleFacebookRequest extends FormRequest
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
            'article_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $marketingProgram = MarketingProgram::whereHas('article', function ($query) use ($value) {
                        $query->where('id', $value);
                    })->first();

                    $article = PostFacebookInfo::where('article_id', $value)->first();
                    
                    if ($marketingProgram->status == MarketingProgram::STATUS['NOT_APPLY']) {
                        return $fail('Chương trình chưa được áp dụng, không thể đăng bài viết');
                    }
                    if (!is_null($article)) {
                        return $fail('Bài viết này đã được đăng lên facebook rồi, vui lòng chọn bài viết khác');
                    }

                    return true;
                },
            ],
        ];
    }
}
