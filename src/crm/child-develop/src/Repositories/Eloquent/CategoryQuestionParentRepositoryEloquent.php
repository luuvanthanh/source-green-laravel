<?php

namespace GGPHP\Crm\ChildDevelop\Repositories\Eloquent;

use GGPHP\Crm\ChildDevelop\Models\CategoryQuestionParent;
use GGPHP\Crm\ChildDevelop\Presenters\CategoryQuestionParentPresenter;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\CategoryQuestionParentRepository;
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
        'created_at'
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
            $this->model = $this->model->whereLike('name', $attributes['key']);
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
        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $value) {
                CategoryQuestionParent::create($value);
            }
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $value) {
                $question = CategoryQuestionParent::find($value['id']);
                $question->update($value);
            }
        }

        if (!empty($attributes['delete_rows'])) {
            CategoryQuestionParent::whereIn('id', $attributes['delete_rows'])->delete();
        }

        return parent::all();
    }
}
