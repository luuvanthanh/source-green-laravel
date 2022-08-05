<?php

namespace GGPHP\TrainingTeacher\Category\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\TrainingTeacher\Category\Models\TrainingSkill;
use GGPHP\TrainingTeacher\Category\Models\TrainingSkillDetail;
use GGPHP\TrainingTeacher\Category\Presenters\TrainingSkillPresenter;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingSkillRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\DB;

/**
 * Class TrainingFormRepositoryEloquent.
 *
 * @package namespace GGPHP\TrainingTeacher\Category\Repositories\Eloquent;
 */
class TrainingSkillRepositoryEloquent extends CoreRepositoryEloquent implements TrainingSkillRepository
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
        return TrainingSkill::class;
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
        return TrainingSkillPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['id'])) {
            $arrayId = explode(',', $attributes['id']);
            $this->model = $this->model->whereIn('Id', $arrayId);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['isEmpty']) && $attributes['isEmpty'] == true) {
            return ['data' => []];
        }

        if (!empty($attributes['limit'])) {
            $trainingSkill = $this->paginate($attributes['limit']);
        } else {
            $trainingSkill = $this->get();
        }

        return $trainingSkill;
    }

    public function create(array $attributes)
    {
        DB::beginTransaction();
        try {
            $trainingSkill = TrainingSkill::create($attributes);

            if (!empty($attributes['detail'])) {
                $this->forDetail($attributes['detail'], $trainingSkill);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return $this->parserResult($trainingSkill);
    }

    public function forDetail($attributes, $trainingSkill)
    {
        if (!empty($attributes['createRows'])) {
            foreach ($attributes['createRows'] as $value) {

                if (!empty($value['trainingHuman'])) {
                    $value['trainingHuman'] = TrainingSkillDetail::TRAINING_HUMAN[$value['trainingHuman']];
                }

                $value['TrainingSkillId'] = $trainingSkill->Id;
                TrainingSkillDetail::create($value);
            }
        }

        if (!empty($attributes['updateRows'])) {
            foreach ($attributes['updateRows'] as $value) {
                $trainingSkillDetail = TrainingSkillDetail::find($value['id']);

                if (!empty($value['trainingHuman'])) {
                    $value['trainingHuman'] = TrainingSkillDetail::TRAINING_HUMAN[$value['trainingHuman']];
                }

                $trainingSkillDetail->update($value);
            }
        }

        if (!empty($attributes['deleteRows'])) {
            TrainingSkillDetail::whereIn('Id', $attributes['deleteRows'])->delete();
        }
    }

    public function update(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $trainingSkill = TrainingSkill::find($id);
            $trainingSkill->update($attributes);

            if (!empty($attributes['detail'])) {
                $this->forDetail($attributes['detail'], $trainingSkill);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return $this->parserResult($trainingSkill);
    }
}
