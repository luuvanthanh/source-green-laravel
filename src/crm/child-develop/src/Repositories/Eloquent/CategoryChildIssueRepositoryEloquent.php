<?php

namespace GGPHP\Crm\ChildDevelop\Repositories\Eloquent;

use GGPHP\Crm\ChildDevelop\Models\CategoryChildIssue;
use GGPHP\Crm\ChildDevelop\Presenters\CategoryChildIssuePresenter;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\CategoryChildIssueRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CategoryChildIssueRepositoryEloquent extends BaseRepository implements CategoryChildIssueRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return CategoryChildIssue::class;
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
        return CategoryChildIssuePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $categoryChildIssue = $this->paginate($attributes['limit']);
        } else {
            $categoryChildIssue = $this->get();
        }

        return $categoryChildIssue;
    }

    public function create(array $attributes)
    {
        $code = CategoryChildIssue::max('code');

        if (is_null($code)) {
            $attributes['code'] = CategoryChildIssue::CODE . '1';
        } else {
            $stt = substr($code, 2) + 1;
            $attributes['code'] = CategoryChildIssue::CODE . $stt;
        }
        $categoryChildIssue = CategoryChildIssue::create($attributes);

        return parent::parserResult($categoryChildIssue);
    }
}
