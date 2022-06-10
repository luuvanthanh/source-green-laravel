<?php

namespace GGPHP\EvaluateTeacher\Category\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\EvaluateTeacher\Category\Contracts\EvaluateTypeRepository;
use GGPHP\EvaluateTeacher\Category\Models\EvaluateType;
use GGPHP\EvaluateTeacher\Category\Models\EvaluateTypeDetail;
use GGPHP\EvaluateTeacher\Category\Presenters\EvaluateTypePresenter;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class PositionLevelRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class EvaluateTypeRepositoryEloquent extends CoreRepositoryEloquent implements EvaluateTypeRepository
{

    /**
     * @var array
     */
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
        return EvaluateType::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return EvaluateTypePresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['id'])) {
            $arrId = explode(',', $attributes['id']);
            $this->model = $this->model->whereIn('Id', $arrId);
        }

        if (!empty($attributes['limit'])) {
            $evaluateType = $this->paginate($attributes['limit']);
        } else {
            $evaluateType = $this->get();
        }

        return $evaluateType;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $evaluateType = EvaluateType::create($attributes);

            if (!empty($attributes['skillGroupId'])) {
                $evaluateType->skillGroup()->sync($attributes['skillGroupId']);
            }

            if (!empty($attributes['detail'])) {
                $this->detail($attributes['detail'], $evaluateType->Id);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($evaluateType->Id);
    }

    public function detail(array $attributes, $id)
    {
        if (!empty($attributes['createRow'])) {
            foreach ($attributes['createRow'] as $value) {
                $value['evaluateTypeId'] = $id;
                $evaluateTypeDetail = EvaluateTypeDetail::create($value);
                $evaluateTypeDetail->ratingLevel()->sync($value['ratingLevelId']);
            }
        }

        if (!empty($attributes['updateRow'])) {
            foreach ($attributes['updateRow'] as $value) {
                $evaluateTypeDetail = EvaluateTypeDetail::find($value['id']);
                $evaluateTypeDetail->update($value);

                if (!empty($value['ratingLevelId'])) {
                    $evaluateTypeDetail->ratingLevel()->detach();
                    $evaluateTypeDetail->ratingLevel()->sync($value['ratingLevelId']);
                }
            }
        }

        if (!empty($attributes['deleteRow'])) {
            EvaluateTypeDetail::whereIn('Id', $attributes['deleteRow'])->delete();
        }

        return true;
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $evaluateType = EvaluateType::find($id);
            $evaluateType->update($attributes);

            if (!empty($attributes['skillGroupId'])) {
                $evaluateType->skillGroup()->detach();
                $evaluateType->skillGroup()->sync($attributes['skillGroupId']);
            }

            if (!empty($attributes['detail'])) {
                $this->detail($attributes['detail'], $evaluateType->Id);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }
}
