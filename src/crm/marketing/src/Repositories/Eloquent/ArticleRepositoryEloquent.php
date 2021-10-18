<?php

namespace GGPHP\Crm\Marketing\Repositories\Eloquent;

use GGPHP\Crm\Marketing\Models\Article;
use GGPHP\Crm\Marketing\Presenters\ArticlePresenter;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

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
}
