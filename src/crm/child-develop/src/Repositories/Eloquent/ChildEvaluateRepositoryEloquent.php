<?php

namespace GGPHP\Crm\ChildDevelop\Repositories\Eloquent;

use GGPHP\Crm\ChildDevelop\Models\ChildEvaluate;
use GGPHP\Crm\ChildDevelop\Models\ChildEvaluateDetail;
use GGPHP\Crm\ChildDevelop\Models\ChildEvaluateDetailChildrent;
use GGPHP\Crm\ChildDevelop\Presenters\ChildEvaluatePresenter;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\ChildEvaluateRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ChildEvaluateRepositoryEloquent extends BaseRepository implements ChildEvaluateRepository
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
        return ChildEvaluate::class;
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
        return ChildEvaluatePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (isset($attributes['age'])) {
            $this->model = $this->model->where('age', $attributes['age']);
        }

        if (!empty($attributes['category_skill_id'])) {
            $this->model = $this->model->where('category_skill_id', $attributes['category_skill_id']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('categorySkill', function ($q) use ($attributes) {
                $q->whereLike('name', $attributes['key']);
            });
        }

        if (!empty($attributes['apply']) && $attributes['apply'] == 'inputAssessment') {
            $this->model = $this->model->whereHas('childEvaluateDetail', function ($q) {
                $q->where('input_assessment', true);
            });
        }

        if (!empty($attributes['apply']) && $attributes['apply'] == 'periodicAssessment') {
            $this->model = $this->model->whereHas('childEvaluateDetail', function ($q) {
                $q->where('periodic_assessment', true);
            });
        }

        if (!empty($attributes['limit'])) {
            $childEvaluate = $this->paginate($attributes['limit']);
        } else {
            $childEvaluate = $this->get();
        }

        return $childEvaluate;
    }

    public function create(array $attributes)
    {
        $attributes['age'] = ChildEvaluate::MONTH[$attributes['age']];
        $childEvaluate = ChildEvaluate::create($attributes);

        if (!empty($attributes['detail'])) {
            $this->storeDetail($childEvaluate->id, $attributes['detail']);
        }

        return parent::find($childEvaluate->id);
    }

    public function storeDetail($id, $detail)
    {
        foreach ($detail as $value) {
            $value['child_evaluate_id'] = $id;
            $detail = ChildEvaluateDetail::create($value);

            if (!empty($value['detail_children'])) {
                $this->storeDetailChildrent($detail->id, $value['detail_children']);
            }
        }

        return true;
    }

    public function storeDetailChildrent($id, $detailChildrent)
    {
        foreach ($detailChildrent as $value) {
            $value['child_evaluate_detail_id'] = $id;
            ChildEvaluateDetailChildrent::create($value);
        }

        return true;
    }

    public function update(array $attributes, $id)
    {
        $attributes['age'] = ChildEvaluate::MONTH[$attributes['age']];
        $childEvaluate = ChildEvaluate::find($id);
        $childEvaluate->update($attributes);

        if (!empty($attributes['detail'])) {
            ChildEvaluateDetail::where('child_evaluate_id', $childEvaluate->id)->delete();
            $this->storeDetail($childEvaluate->id, $attributes['detail']);
        }

        return parent::find($id);
    }

    public function updateUse(array $attributes, $id)
    {
        $childEvaluate = ChildEvaluate::find($id);
        $childEvaluate->update($attributes);

        return parent::find($id);
    }
}
