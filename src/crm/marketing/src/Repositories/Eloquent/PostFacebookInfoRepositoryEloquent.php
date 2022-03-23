<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

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
}
