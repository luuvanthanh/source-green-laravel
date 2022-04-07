<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Services\FacebookService;
use GGPHP\Crm\Marketing\Models\Article;
use GGPHP\Crm\Marketing\Models\ArticleCommentInfo;
use GGPHP\Crm\Marketing\Models\ArticleCommentInfoDetail;
use GGPHP\Crm\Marketing\Models\ArticleReactionInfo;
use GGPHP\Crm\Marketing\Models\PostFacebookInfo;
use GGPHP\Crm\Marketing\Presenters\ArticlePresenter;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Illuminate\Container\Container as Application;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ArticleRepositoryEloquent extends BaseRepository implements ArticleRepository
{

    public function __construct(
        DataMarketingRepositoryEloquent $dataMarketingRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->dataMarketingRepositoryEloquent = $dataMarketingRepositoryEloquent;
    }
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Article::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ArticlePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['marketing_program_id'])) {
            $this->model = $this->model->where('marketing_program_id', $attributes['marketing_program_id']);
            if (!empty($attributes['data_page'])) {
                $this->quantityShare($this->model->get(), $attributes);
            }
        }

        if (!empty($attributes['limit'])) {
            $article = $this->paginate($attributes['limit']);
        } else {
            $article = $this->get();
        }

        return $article;
    }

    public function postArticleFacebook($attributes)
    {
        $response = [];
        $article = Article::findOrFail($attributes['article_id']);

        if (isset($attributes['data_page'])) {
            foreach ($attributes['data_page'] as $value) {
                $value['message'] = $article->name . "\n" . $article->content;

                if ($article->file_image == '[]') {
                    $response = FacebookService::publishPagePost($value);
                    $facebook_post_id = $response->id;
                } else {
                    $paths = json_decode($article->file_image);

                    foreach ($paths as $path) {
                        $urls[] = env('IMAGE_URL') . $path;
                    }
                    $video = false;
                    foreach ($urls as $url) {
                        if (pathinfo($url, PATHINFO_EXTENSION) == 'mp4') {
                            $video = true;
                            break;
                        }
                    }
                    if ($video) {
                        $value['title'] = $article->name;
                        $value['description'] = $article->content;
                        $response = FacebookService::publishPagePostWithVideo($value, $urls);

                        $video_id = $response->id;
                    } else {
                        $response = FacebookService::publishPagePostWithImage($value, $urls);
                        $facebook_post_id = $response->id;
                    }
                }


                $pageId = Page::where('page_id_facebook', $value['page_id'])->select('id')->first();

                if (isset($video_id)) {
                    $data = [
                        'article_id' => $article->id,
                        'video_id' => $video_id,
                        'page_id' => $pageId->id
                    ];
                } else {
                    $data = [
                        'article_id' => $article->id,
                        'facebook_post_id' => $facebook_post_id,
                        'page_id' => $pageId->id
                    ];
                }

                PostFacebookInfo::create($data);
            }
        }

        return $response;
    }

    public function postFacebookInfo($attributes)
    {
        if (isset($attributes['value']['post_id'])) {
            $post_id = $attributes['value']['post_id'];
            $postFacebookInfo = PostFacebookInfo::where('facebook_post_id', $post_id)->first();
            if (!empty($postFacebookInfo)) {
                if (!isset($attributes['value']['comment_id'])) {
                    if ($attributes['value']['item'] == 'reaction' && $attributes['value']['verb'] == 'add') {
                        $quantity_reaction = $postFacebookInfo->quantity_reaction;
                        $postFacebookInfo->quantity_reaction = $quantity_reaction + 1;
                        FacebookService::createUserFacebookInfo($attributes);
                        $this->dataMarketingRepositoryEloquent->syncDataAuto($attributes);
                        $dataLike = [
                            'post_facebook_info_id' => $postFacebookInfo->id,
                            'full_name' => $attributes['value']['from']['name'],
                            'reaction_type' => strtoupper($attributes['value']['reaction_type']),
                            'interactive_id' => $attributes['value']['from']['id']
                        ];
                        $articleReactionInfo  = ArticleReactionInfo::where('post_facebook_info_id', $postFacebookInfo->id)->where('interactive_id', $attributes['value']['from']['id'])->first();
                        if (is_null($articleReactionInfo)) {
                            ArticleReactionInfo::create($dataLike);
                        } else {
                            $articleReactionInfo->reaction_type = strtoupper($attributes['value']['reaction_type']);
                            $articleReactionInfo->update();
                        }
                    } elseif ($attributes['value']['item'] == 'reaction' && $attributes['value']['verb'] == 'remove') {
                        $quantity_reaction = $postFacebookInfo->quantity_reaction;
                        $postFacebookInfo->quantity_reaction = $quantity_reaction - 1;
                    } elseif ($attributes['value']['item'] == 'reaction' && $attributes['value']['verb'] == 'edit') {
                        $articleReactionInfo  = ArticleReactionInfo::where('post_facebook_info_id', $postFacebookInfo->id)->where('interactive_id', $attributes['value']['from']['id'])->first();
                        $articleReactionInfo->reaction_type = strtoupper($attributes['value']['reaction_type']);
                        $articleReactionInfo->update();
                    }
                }

                if ($attributes['value']['item'] == 'comment' && $attributes['value']['verb'] == 'add') {
                    $quantity_comment = $postFacebookInfo->quantity_comment;
                    $postFacebookInfo->quantity_comment = $quantity_comment + 1;
                    FacebookService::createUserFacebookInfo($attributes);
                    $this->dataMarketingRepositoryEloquent->syncDataAuto($attributes);
                    $dataComment = [
                        'post_facebook_info_id' => $postFacebookInfo->id,
                        'full_name' => $attributes['value']['from']['name'],
                        'content' => $attributes['value']['message'],
                        'interactive_id' => $attributes['value']['from']['id'],
                        'comment_id' => $attributes['value']['comment_id'],
                        'parent_id' => $attributes['value']['parent_id'],
                    ];
                    $articleCommentInfo = ArticleCommentInfo::where('comment_id', $attributes['value']['parent_id'])->first();

                    if (!is_null($articleCommentInfo)) {
                        $dataComment['article_comment_info_id'] = $articleCommentInfo->id;
                        ArticleCommentInfoDetail::create($dataComment);
                    } else {
                        ArticleCommentInfo::create($dataComment);
                    }
                } elseif ($attributes['value']['item'] == 'comment' && $attributes['value']['verb'] == 'remove') {
                    $quantity_comment = $postFacebookInfo->quantity_comment;
                    $postFacebookInfo->quantity_comment = $quantity_comment - 1;
                }

                $postFacebookInfo->update();
            }

            if ($attributes['value']['item'] == 'post' && $attributes['value']['verb'] == 'remove') {
                PostFacebookInfo::where('facebook_post_id', $attributes['value']['post_id'])->forceDelete();
            }
        }
    }

    public function deleteArticle($id, $attributes)
    {
        \DB::beginTransaction();
        try {
            $postFacebookInfo = PostFacebookInfo::where('article_id', $id)->first();
            $attributes['facebook_post_id'] = $postFacebookInfo->facebook_post_id;
            $response = FacebookService::deletePagePost($attributes);

            if ($response->success) {
                $postFacebookInfo->forceDelete();
            }
            Article::where('id', $id)->delete();
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }
        return null;
    }

    public function quantityShare($article, $attributes)
    {
        foreach ($article as $value) {
            foreach (json_decode($attributes['data_page']) as $dataPage) {
                $page = Page::where('page_id_facebook', $dataPage->page_id)->select('id')->first();
                $postFacebookInfo = PostFacebookInfo::where('page_id', $page->id)->where('article_id', $value->id)->first();
                
                if (!is_null($postFacebookInfo)) {
                    $attributes['page_access_token'] = $dataPage->page_access_token;
                    $attributes['post_id'] = $postFacebookInfo->facebook_post_id;
                    $response = FacebookService::getQuantitySharePost($attributes);

                    if (isset($response->shares)) {
                        $postFacebookInfo->update(['quantity_share' => $response->shares->count]);
                    }
                }
            }
        }

        return null;
    }
}
