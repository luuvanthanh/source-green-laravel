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

        if (!empty($attributes['categorySkillId'])) {
            $this->model = $this->model->where('CategorySkillId', $attributes['categorySkillId']);
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
                $childEvaluate['detail'] = $this->storeDetail($childEvaluate->Id, $attributes['detail']);
            }

            if ($attributes['detail'][0]['inputAssessment']) {
                $data = $childEvaluate->toArray();
                $childEvaluateCrmId = ChildEvaluateCrmServices::createChildEvaluate($data, $childEvaluate->Id);

                if (isset($childEvaluateCrmId->data->id)) {
                    $updateCrmId = ChildEvaluate::find($childEvaluate->Id);
                    $updateCrmId->update(['ChildEvaluateCrmId' => $childEvaluateCrmId->data->id]);
                }
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
        return parent::find($childEvaluate->Id);
    }

    public function storeDetail($id, $detail)
    {
        $arrDetail = [];
        foreach ($detail as $value) {
            $value['totalScore'] = ChildEvaluateDetail::TOTAL_SCORE;
            $value['ChildEvaluateId'] = $id;
            $detail = ChildEvaluateDetail::create($value);

            if (!empty($value['detailChildren'])) {
                $score = ChildEvaluateDetail::TOTAL_SCORE / count($value['detailChildren']);
                $detail['detailChildren'] = $this->storeDetailChildren($detail->Id, $value['detailChildren'], $score);
            }

            $arrDetail[] = $detail->toArray();
        }

        return $arrDetail;
    }

    public function storeDetailChildren($id, $detailChildren, $score)
    {
        $arrChildren = [];
        foreach ($detailChildren as $value) {
            $value['score'] = $score;
            $value['ChildEvaluateDetailId'] = $id;
            $detailChildren = ChildEvaluateDetailChildren::create($value);

            $arrChildren[] = [
                'child_evaluate_detail_children_clover_id' => $detailChildren->Id,
                'content' => $detailChildren->Content,
                'use' =>  $detailChildren->Use
            ];
        }

        return $arrChildren;
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $childEvaluate = ChildEvaluate::find($id);
            $childEvaluate->update($attributes);

            if (!empty($attributes['detail'])) {
                $childEvaluate['detail'] = $this->updateDetail($childEvaluate, $attributes['detail'][0]);
            }

            if ($attributes['detail'][0]['inputAssessment']) {
                $data = $childEvaluate->toArray();

                if (!is_null($childEvaluate->ChildEvaluateCrmId)) {
                    ChildEvaluateCrmServices::updateChildEvaluate($data, $childEvaluate->ChildEvaluateCrmId);
                }
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

    public function updateDetail($childEvaluate, $attributes)
    {
        $childEvaluateDetail = $childEvaluate->childEvaluateDetail()->find($attributes['id']);
        $attributes['totalScore'] = ChildEvaluateDetail::TOTAL_SCORE;
        $childEvaluateDetail->update($attributes);

        if (!empty($attributes['detailChildren'])) {
            $childEvaluateDetailChildren = $this->updateDetailChildren($childEvaluateDetail, $attributes['detailChildren']);
        }

        $score = ChildEvaluateDetail::TOTAL_SCORE / count($childEvaluateDetailChildren['dataForCount']);
        foreach ($childEvaluateDetailChildren['dataForCount'] as $key => $value) {
            $value->update(['Score' => $score]);
        }

        $childEvaluateDetail['detailChildren'] = $childEvaluateDetailChildren['detailChildren'];
        $arrDetail[] = $childEvaluateDetail->toArray();

        return $arrDetail;
    }

    public function updateDetailChildren($childEvaluateDetail, $attributes)
    {
        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $key => $valueCreate) {
                $valueCreate['ChildEvaluateDetailId'] = $childEvaluateDetail->Id;
                $detailChildren = ChildEvaluateDetailChildren::create($valueCreate);

                $arrChildren[] = [
                    'child_evaluate_detail_children_clover_id' => $detailChildren->Id,
                    'content' => $detailChildren->Content,
                    'use' =>  $detailChildren->Use
                ];
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $key => $valueUpdate) {
                $childEvaluateDetailChildren = $childEvaluateDetail->childEvaluateDetailChildren()->find($valueUpdate['id']);

                if (!is_null($childEvaluateDetailChildren)) {
                    $childEvaluateDetailChildren->update($valueUpdate);
                }

                $arrChildren[] = [
                    'child_evaluate_detail_children_clover_id' => $childEvaluateDetailChildren->Id,
                    'content' => $childEvaluateDetailChildren->Content,
                    'use' =>  $childEvaluateDetailChildren->Use
                ];
            }
        }

        if (!empty($attributes['deleteRows'])) {
            $childEvaluateDetail->childEvaluateDetailChildren()->whereIn('Id', $attributes['deleteRows'])->delete();
        }

        $result['dataForCount'] = $childEvaluateDetail->childEvaluateDetailChildren;
        $result['detailChildren'] = $arrChildren;

        return $result;
    }
}
