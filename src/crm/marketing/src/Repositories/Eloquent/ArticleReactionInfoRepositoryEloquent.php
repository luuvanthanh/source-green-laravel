<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use GGPHP\Crm\Marketing\Models\ArticleReactionInfo;
use GGPHP\Crm\Marketing\Presenters\ArticleReactionInfoPresenter;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleReactionInfoRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class EventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class ArticleReactionInfoRepositoryEloquent extends BaseRepository implements ArticleReactionInfoRepository
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
        return ArticleReactionInfo::class;
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
        return ArticleReactionInfoPresenter::class;
    }

    public function getArticleReactionInfo(array $attributes)
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
