<?php

namespace GGPHP\EvaluateTeacher\Category\Repositories\Eloquent;

use GGPHP\EvaluateTeacher\Category\Models\EvaluateStep;
use GGPHP\EvaluateTeacher\Category\Presenters\EvaluateStepPresenter;
use GGPHP\EvaluateTeacher\Category\Repositories\Contracts\EvaluateStepRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class EvaluateStepRepositoryEloquent.
 *
 * @package namespace GGPHP\EvaluateTeacher\Category\Repositories\Eloquent;
 */
class EvaluateStepRepositoryEloquent extends CoreRepositoryEloquent implements EvaluateStepRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return EvaluateStep::class;
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
        return EvaluateStepPresenter::class;
    }

    public function getEvaluateStep(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $evaluateStep = $this->paginate($attributes['limit']);
        } else {
            $evaluateStep = $this->get();
        }

        return $evaluateStep;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $evaluateStep = EvaluateStep::create($attributes);
            $evaluateStep->evaluateType()->attach($attributes['evaluateTypeId']);
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::parserResult($evaluateStep);
    }

    public function update(array $attributes, $id)
    {
        $evaluateStep = EvaluateStep::findOrFail($id);

        \DB::beginTransaction();
        try {
            $evaluateStep->update($attributes);
            if (!empty($attributes['evaluateTypeId'])) {
                $evaluateStep->evaluateType()->detach();
                $evaluateStep->evaluateType()->attach($attributes['evaluateTypeId']);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }
        return parent::parserResult($evaluateStep);
    }
}
