<?php

namespace GGPHP\StudyProgram\Setting\Repositories\Eloquent;

use GGPHP\StudyProgram\Setting\Models\EvaluationCriteria;
use GGPHP\StudyProgram\Setting\Presenters\EvaluationCriteriaPresenter;
use GGPHP\StudyProgram\Setting\Repositories\Contracts\EvaluationCriteriaRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class EvaluationCriteriaRepositoryEloquent extends BaseRepository implements EvaluationCriteriaRepository
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
        return EvaluationCriteria::class;
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
        return EvaluationCriteriaPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model()::whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $subject = $this->paginate($attributes['limit']);
        } else {
            $subject = $this->get();
        }

        return $subject;
    }

    public function createAll(array $attributes)
    {
        return parent::parserResult($this->model()::create($attributes));
    }

    public function updateAll(array $attributes, $id)
    {
        $evaluationCriteria = $this->model()::find($id);
        $evaluationCriteria->update($attributes);

        return parent::parserResult($evaluationCriteria);
    }
}
