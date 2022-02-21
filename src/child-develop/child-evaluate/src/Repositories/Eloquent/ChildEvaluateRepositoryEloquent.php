<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Repositories\Eloquent;

use GGPHP\ChildDevelop\ChildEvaluate\Presenters\ChildEvaluatePresenter;
use GGPHP\ChildDevelop\ChildEvaluate\Repositories\Contracts\ChildEvaluateRepository;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetail;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetailChildren;
use GGPHP\ChildDevelop\ChildEvaluate\Services\ChildEvaluateCrmServices;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

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
        if (isset($attributes['age'])) {
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

        if (!empty($attributes['apply']) && $attributes['apply'] == 'inputAssessment') {
            $this->model = $this->model->whereHas('childEvaluateDetail', function ($q) {
                $q->where('InputAssessment', true);
            });
        }

        if (!empty($attributes['apply']) && $attributes['apply'] == 'periodicAssessment') {
            $this->model = $this->model->whereHas('childEvaluateDetail', function ($q) {
                $q->where('PeriodicAssessment', true);
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
        \DB::beginTransaction();
        try {
            $childEvaluate = ChildEvaluate::create($attributes);

            if (!empty($attributes['detail'])) {
                $this->storeDetail($childEvaluate->Id, $attributes['detail']);
            }

            $childEvaluateCrmId = ChildEvaluateCrmServices::createChildEvaluate($attributes, $childEvaluate->Id);

            if (isset($childEvaluateCrmId->data->id)) {
                $childEvaluate->ChildEvaluateCrmId = $childEvaluateCrmId->data->id;
                $childEvaluate->update();
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
        return parent::all();
    }

    public function storeDetail($id, $detail)
    {
        foreach ($detail as $value) {
            $value['ChildEvaluateId'] = $id;
            $detail = ChildEvaluateDetail::create($value);

            if (!empty($value['detailChildren'])) {
                $this->storeDetailChildren($detail->Id, $value['detailChildren']);
            }
        }

        return true;
    }

    public function storeDetailChildren($id, $detailChildrent)
    {
        foreach ($detailChildrent as $value) {
            $value['ChildEvaluateDetailId'] = $id;
            ChildEvaluateDetailChildren::create($value);
        }

        return true;
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $childEvaluate = ChildEvaluate::find($id);
            $childEvaluate->update($attributes);

            if (!empty($attributes['detail'])) {
                ChildEvaluateDetail::where('ChildEvaluateId', $childEvaluate->Id)->delete();
                $this->storeDetail($childEvaluate->Id, $attributes['detail']);
            }

            if (!is_null($childEvaluate->ChildEvaluateCrmId)) {
                ChildEvaluateCrmServices::updateChildEvaluate($attributes, $childEvaluate->ChildEvaluateCrmId);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }

    public function delete($id)
    {
        \DB::beginTransaction();
        try {
            $childEvaluate = ChildEvaluate::findOrFail($id);

            if (!is_null($childEvaluate->ChildEvaluateCrmId)) {
                ChildEvaluateCrmServices::deleteChildEvaluate($childEvaluate->ChildEvaluateCrmId);
            }
            $childEvaluate->delete();

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::all();
    }

    public function updateIsUse(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $childEvaluate = ChildEvaluate::findOrFail($id);
            $childEvaluate->update($attributes);

            if (!is_null($childEvaluate->ChildEvaluateCrmId)) {
                ChildEvaluateCrmServices::updateIsUse($attributes, $childEvaluate->ChildEvaluateCrmId);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($childEvaluate->Id);
    }
}
