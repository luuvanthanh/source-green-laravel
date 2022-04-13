<?php

namespace GGPHP\Crm\Marketing\Http\Requests;

use GGPHP\Crm\Facebook\Models\Page;
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
            'data_page' => 'array|required',
            'article_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $marketingProgram = MarketingProgram::whereHas('article', function ($query) use ($value) {
                        $query->where('id', $value);
                    })->first();

                    if ($marketingProgram->status == MarketingProgram::STATUS['NOT_APPLY']) {
                        return $fail('Chương trình chưa được áp dụng, không thể đăng bài viết');
                    }
                    $stringArray = [];

                    foreach (request()->data_page as $data_page) {
                        $page = Page::where('page_id_facebook', $data_page['page_id'])->first();
                        $postFacebookInfo = PostFacebookInfo::where('article_id', $value)->where('page_id', $page->id)->first();

                        if (!is_null($postFacebookInfo)) {
                            $stringArray[] = is_null($postFacebookInfo->page) ? '' : $postFacebookInfo->page->name;
                        }
                    }

                    if (!empty($stringArray)) {
                        $result = implode(', ', $stringArray);
                    } else {
                        $result = [];
                    }

                    if (!empty($result)) {
                        return $fail('Bài viết này đã được đăng lên trang facebook' . ' ' . $result);
                    }

                    return true;
                },
            ],
        ];
    }
}
