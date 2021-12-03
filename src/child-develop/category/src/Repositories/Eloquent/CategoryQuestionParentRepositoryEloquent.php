<?php

namespace GGPHP\ChildDevelop\Category\Repositories\Eloquent;

use GGPHP\ChildDevelop\Category\Models\CategoryQuestionParent;
use GGPHP\ChildDevelop\Category\Presenters\CategoryQuestionParentPresenter;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\CategoryQuestionParentRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CategoryQuestionParentRepositoryEloquent extends BaseRepository implements CategoryQuestionParentRepository
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
        return CategoryQuestionParent::class;
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
        return CategoryQuestionParentPresenter::class;
    }

    public function getAll($attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $categoryQuestionParent = $this->paginate($attributes['limit']);
        } else {
            $categoryQuestionParent = $this->get();
        }

        return $categoryQuestionParent;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $value) {
                CategoryQuestionParent::create($value);
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $value) {
                $question = CategoryQuestionParent::find($value['id']);
                $question->update($value);
            }
        }

        if (!empty($attributes['deleteRows'])) {
            CategoryQuestionParent::whereIn('Id', $attributes['deleteRows'])->delete();
        }

        return parent::all();
    }
}
