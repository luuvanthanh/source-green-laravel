<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use GGPHP\Crm\Facebook\Services\FacebookService;
use GGPHP\Crm\Marketing\Models\Article;
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
        $article = Article::findOrFail($attributes['article_id']);

        $attributes['message'] = $article->name . "\n \n" . $article->content;

        if (is_null($article->file_image)) {
            $response = FacebookService::publishPagePost($attributes);
            $facebook_post_id = $response->id;
        } else {
            $path = json_decode($article->file_image);
            $url = env('IMAGE_URL') . $path[0];
            if (pathinfo($url, PATHINFO_EXTENSION) == "mp4") {
                $attributes['title'] = $article->name;
                $attributes['description'] = $article->content;
                $response = FacebookService::publishPagePostWithVideo($attributes, $url);

                $video_id = $response->id;
            } else {
                $response = FacebookService::publishPagePostWithImage($attributes, $url);
                $facebook_post_id = $response->post_id;
            }
        }

        $postFacebookInfo = PostFacebookInfo::where('article_id', $article->id)->first();
        if (isset($video_id)) {
            $data = [
                'article_id' => $article->id,
                'video_id' => $video_id
            ];
        } else {
            $data = [
                'article_id' => $article->id,
                'facebook_post_id' => $facebook_post_id
            ];
        }

        PostFacebookInfo::create($data);

        return $response;
    }

    public static function postFacebookInfo($attributes)
    {
        if (isset($attributes['value']['post_id'])) {
            $post_id = $attributes['value']['post_id'];
            $postFacebookInfo = PostFacebookInfo::where('facebook_post_id', $post_id)->first();

            if (!isset($attributes['value']['comment_id'])) {
                if ($attributes['value']['item'] == "reaction" && $attributes['value']['verb'] == "add") {
                    $quantity_reaction = $postFacebookInfo->quantity_reaction;
                    $postFacebookInfo->quantity_reaction = $quantity_reaction + 1;
                } elseif ($attributes['value']['item'] == "reaction" && $attributes['value']['verb'] == "remove") {
                    $quantity_reaction = $postFacebookInfo->quantity_reaction;
                    $postFacebookInfo->quantity_reaction = $quantity_reaction - 1;
                }
            }

            if ($attributes['value']['item'] == "comment" && $attributes['value']['verb'] == "add") {
                $quantity_comment = $postFacebookInfo->quantity_comment;
                $postFacebookInfo->quantity_comment = $quantity_comment + 1;
            } elseif ($attributes['value']['item'] == "comment" && $attributes['value']['verb'] == "remove") {
                $quantity_comment = $postFacebookInfo->quantity_comment;
                $postFacebookInfo->quantity_comment = $quantity_comment - 1;
            }

            $postFacebookInfo->update();

            if ($attributes['value']['item'] == "post" && $attributes['value']['verb'] == "remove") {
                PostFacebookInfo::where('facebook_post_id', $attributes['value']['post_id'])->delete();
            }

            FacebookService::createUserFacebookInfo($attributes);
        }
    }
}
