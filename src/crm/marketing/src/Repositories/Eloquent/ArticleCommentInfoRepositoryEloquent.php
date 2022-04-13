<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use GGPHP\Crm\Marketing\Models\ArticleCommentInfo;
use GGPHP\Crm\Marketing\Presenters\ArticleCommentInfoPresenter;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleCommentInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class EventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class ArticleCommentInfoRepositoryEloquent extends BaseRepository implements ArticleCommentInfoRepository
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
        return ArticleCommentInfo::class;
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
        return ArticleCommentInfoPresenter::class;
    }

    public function getArticleCommentInfo(array $attributes)
    {
        if (!empty($attributes['post_facebook_info_id'])) {
            $this->model = $this->model->where('post_facebook_info_id', $attributes['post_facebook_info_id']);
        }

        if (!empty($attributes['page_id']) && !empty($attributes['article_id'])) {
            $this->model = $this->model->whereHas('postFacebookInfo', function ($query) use ($attributes) {
                $query->where('page_id', $attributes['page_id'])->where('article_id', $attributes['article_id']);
            });
        }

        if (!empty($attributes['limit'])) {
            $articleReactionInfo = $this->paginate($attributes['limit']);
        } else {
            $articleReactionInfo = $this->get();
        }

        return $articleReactionInfo;
    }
}
