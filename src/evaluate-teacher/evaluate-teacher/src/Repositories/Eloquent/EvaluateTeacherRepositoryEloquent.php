<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Repositories\Eloquent;

use GGPHP\EvaluateTeacher\EvaluateTeacher\Models\EvaluateTeacher;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Presenters\EvaluateTeacherPresenter;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Repositories\Contracts\EvaluateTeacherRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Models\EvaluateTeacherDetail;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class EvaluateTeacherRepositoryEloquent.
 *
 * @package namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Repositories\Eloquent;
 */
class EvaluateTeacherRepositoryEloquent extends CoreRepositoryEloquent implements EvaluateTeacherRepository
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
        return EvaluateTeacher::class;
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
        return EvaluateTeacherPresenter::class;
    }

    public function getEvaluateTeacher(array $attributes)
    {
        if (!empty($attributes['evaluateStepId'])) {
            $this->model = $this->model->whereHas('evaluateStep', function ($query) use ($attributes) {
                $query->where('Id', $attributes['evaluateStepId']);
            });
        }

        if (!empty($attributes['evaluateTypeId'])) {
            $this->model = $this->model->whereHas('evaluateType', function ($query) use ($attributes) {
                $query->where('Id', $attributes['evaluateTypeId']);
            });
        }

        if (!empty($attributes['ratingLevelId'])) {
            $this->model = $this->model->whereHas('ratingLevel', function ($query) use ($attributes) {
                $query->where('Id', $attributes['ratingLevelId']);
            });
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->whereLike('TeacherEvaluate', $attributes['key'])
                    ->orWhereLike('TeacherAreEvaluate', $attributes['key']);
            });
        }

        if (!empty($attributes['selfEvaluate']) && (!empty($attributes['teacherEvaluate']) || !empty($attributes['teacherAreEvaluate']))) {
            $this->model = $this->model->whereHas('evaluateType', function ($query) use ($attributes) {
                $query->where('SelfEvaluate', $attributes['selfEvaluate']);
            })->when(!empty($attributes['teacherEvaluate']), function ($query01) use ($attributes) {
                $query01->where('TeacherEvaluate', $attributes['teacherEvaluate']);
            })->when(!empty($attributes['teacherAreEvaluate']), function ($query02) use ($attributes) {
                $query02->where('TeacherAreEvaluate', $attributes['teacherAreEvaluate']);
            });
        }

        if (!empty($attributes['limit'])) {
            $degree = $this->paginate($attributes['limit']);
        } else {
            $degree = $this->get();
        }

        return $degree;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $evaluateTeacher = EvaluateTeacher::create($attributes);
            foreach ($attributes['detail'] as  $value) {
                $value['evaluateTeacherId'] = $evaluateTeacher->Id;
                EvaluateTeacherDetail::create($value);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return $this->parserResult($evaluateTeacher);
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $evaluateTeacher = EvaluateTeacher::find($id);
            $evaluateTeacher->update($attributes);
            $evaluateTeacher->evaluateTeacherDetail()->delete();
            foreach ($attributes['detail'] as  $value) {
                $value['evaluateTeacherId'] = $evaluateTeacher->Id;
                EvaluateTeacherDetail::create($value);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return $this->parserResult($evaluateTeacher);
    }
}
