<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Repositories\Eloquent;

use GGPHP\ChildDevelop\ChildEvaluate\Presenters\ChildEvaluatePresenter;
use GGPHP\ChildDevelop\ChildEvaluate\Repositories\Contracts\ChildEvaluateRepository;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetail;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetailChildrent;
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
        'Id', 'CreationTime'
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
        if (!empty($attributes['age'])) {
            $this->model = $this->model->where('Age', $attributes['age']);
        }

        if (!empty($attributes['CategorySkillId'])) {
            $this->model = $this->model->where('CategorySkillId', $attributes['CategorySkillId']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('categorySkill', function ($q) use ($attributes) {
                $q->whereLike('Name', $attributes['key']);
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
            $this->storeDetail($childEvaluate->Id, $attributes['detail']);
        }

        return parent::all();
    }

    public function storeDetail($id, $detail)
    {
        foreach ($detail as $value) {
            $value['ChildEvaluateId'] = $id;
            $detail = ChildEvaluateDetail::create($value);
            $this->storeDetailChildrent($detail->Id, $value['detailChildren']);
        }

        return true;
    }

    public function storeDetailChildrent($id, $detailChildrent)
    {
        foreach ($detailChildrent as $value) {
            $value['ChildEvaluateDetailId'] = $id;
            ChildEvaluateDetailChildrent::create($value);
        }

        return true;
    }

    public function update(array $attributes, $id)
    {
        $attributes['age'] = ChildEvaluate::MONTH[$attributes['age']];
        $childEvaluate = ChildEvaluate::find($id);
        $childEvaluate->update($attributes);

        ChildEvaluateDetail::where('ChildEvaluateId', $childEvaluate->Id)->delete();

        if (!empty($attributes['detail'])) {
            $this->storeDetail($childEvaluate->Id, $attributes['detail']);
        }

        return parent::find($id);
    }
}
