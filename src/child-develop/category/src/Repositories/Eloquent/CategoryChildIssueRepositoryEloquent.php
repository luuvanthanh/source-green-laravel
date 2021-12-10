<?php

namespace GGPHP\ChildDevelop\Category\Repositories\Eloquent;

use GGPHP\ChildDevelop\Category\Models\CategoryChildIssue;
use GGPHP\ChildDevelop\Category\Presenters\CategoryChildIssuePresenter;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\CategoryChildIssueRepository;
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
        'Id', 'CreationTime'
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
            $this->model = $this->model->whereLike('Name', $attributes['key']);
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
        $code = CategoryChildIssue::max('Code');

        if (is_null($code)) {
            $attributes['Code'] = CategoryChildIssue::CODE . "1";
        } else {
            $stt = substr($code, 2) + 1;
            $attributes['Code'] = CategoryChildIssue::CODE . "$stt";
        }
        $categoryChildIssue = CategoryChildIssue::create($attributes);

        return parent::parserResult($categoryChildIssue);
    }

    public function update(array $attributes, $id)
    {
        $categoryChildIssue = CategoryChildIssue::find($id);
        $categoryChildIssue->update($attributes);

        return parent::find($id);
    }
}
