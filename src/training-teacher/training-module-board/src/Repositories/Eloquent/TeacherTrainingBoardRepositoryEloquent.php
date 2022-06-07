<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Models\TeacherTrainingBoard;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Models\TeacherTrainingBoardDetail;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Models\TeacherTrainingBoardDetailChildren;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Presenters\TeacherTrainingBoardPresenter;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Repositories\Contracts\TeacherTrainingBoardRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TrainingFormRepositoryEloquent.
 *
 * @package namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Repositories\Eloquent;
 */
class TeacherTrainingBoardRepositoryEloquent extends CoreRepositoryEloquent implements TeacherTrainingBoardRepository
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
        return TeacherTrainingBoard::class;
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
        return TeacherTrainingBoardPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $TeacherTrainingBoard = $this->paginate($attributes['limit']);
        } else {
            $TeacherTrainingBoard = $this->get();
        }

        return $TeacherTrainingBoard;
    }

    public function createAll(array $attributes)
    {
        DB::beginTransaction();
        try {
            $teacherTrainingBoard = $this->model()::create($attributes);

            if (!empty($attributes['detail'])) {
                $this->forDetail($attributes['detail'], $teacherTrainingBoard);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }

        return $this->parserResult($teacherTrainingBoard);
    }

    public function forDetail(array $attributes, $model)
    {
        foreach ($attributes['createRows'] as $valueCreate) {
            $valueCreate['TeacherTrainingBoardId'] = $model->Id;
            $modelDetail = TeacherTrainingBoardDetail::create($valueCreate);

            if (!empty($valueCreate['trainingModuleDetail'])) {
                $this->forChildren($valueCreate['trainingModuleDetail'], $modelDetail);
            }
        }

        foreach ($attributes['updateRows'] as $valueUpdate) {
            $modelDetail = TeacherTrainingBoardDetail::find($valueUpdate['id']);
            $modelDetail->update($valueUpdate);

            if (!empty($valueUpdate['trainingModuleDetail'])) {
                $this->forChildren($valueUpdate['trainingModuleDetail'], $modelDetail);
            }
        }

        if (!empty($attributes['deleteRows'])) {
            TeacherTrainingBoardDetail::whereIn('Id', $attributes['deleteRows'])->delete();
        }

        return true;
    }

    public function forChildren(array $attributes, $modelDetail)
    {
        $modelDetail->teacherTrainingBoardDetailChildren()->delete();

        foreach ($attributes as $valueChildren) {
            $valueChildren['TeacherTrainingBoardDetailId'] = $modelDetail->Id;
            TeacherTrainingBoardDetailChildren::create($valueChildren);
        }
    }

    public function updateAll(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $teacherTrainingBoard = $this->model->find($id);
            $teacherTrainingBoard->update($attributes);

            if (!empty($attributes['detail'])) {
                $this->forDetail($attributes['detail'], $teacherTrainingBoard);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }

        return $this->parserResult($teacherTrainingBoard);
    }
}
