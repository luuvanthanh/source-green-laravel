<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\QuestionReview;
use GGPHP\Crm\Category\Presenters\QuestionReviewPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\QuestionReviewRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class QuestionReviewRepositoryEloquent extends BaseRepository implements QuestionReviewRepository
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
        return QuestionReview::class;
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
        return QuestionReviewPresenter::class;
    }

    public function getAll($attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $questionReview = $this->paginate($attributes['limit']);
        } else {
            $questionReview = $this->get();
        }

        return $questionReview;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $value) {
                QuestionReview::create($value);
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $value) {
                $question = QuestionReview::find($value['id']);
                $question->update($value);
            }
        }

        if (!empty($attributes['deleteRows'])) {
            QuestionReview::whereIn('id', $attributes['deleteRows'])->delete();
        }

        return parent::all();
    }
}
