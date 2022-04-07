<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Services\FacebookService;
use GGPHP\Crm\Marketing\Models\Article;
use GGPHP\Crm\Marketing\Models\PostFacebookInfo;
use GGPHP\Crm\Marketing\Presenters\PostFacebookInfoPresenter;
use GGPHP\Crm\Marketing\Repositories\Contracts\PostFacebookInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class EventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class PostFacebookInfoRepositoryEloquent extends BaseRepository implements PostFacebookInfoRepository
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
        return PostFacebookInfo::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return PostFacebookInfoPresenter::class;
    }

    public function getPostFacebookInfo(array $attributes)
    {
        if (!empty($attributes['article_id'])) {
            $this->model = $this->model->where('article_id', $attributes['article_id']);
        }

        if (!empty($attributes['limit'])) {
            $postFacebookInfo = $this->paginate($attributes['limit']);
        } else {
            $postFacebookInfo = $this->get();
        }

        return $postFacebookInfo;
    }

    public function quantityShare($attributes)
    {
        if (!empty($attributes['data_page'])) {
            foreach (json_decode($attributes['data_page']) as $dataPage) {
                $page = Page::where('page_id_facebook', $dataPage->page_id)->select('id')->first();
                $postFacebookInfo = PostFacebookInfo::where('page_id', $page->id)->where('article_id', $attributes['article_id'])->first();

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
