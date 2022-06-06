<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingSchedule;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingScheduleDetail;
use GGPHP\TrainingTeacher\TrainingSchedule\Presenters\TrainingSchedulePresenter;
use GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Contracts\TrainingScheduleRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TrainingFormRepositoryEloquent.
 *
 * @package namespace GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Eloquent;
 */
class TrainingScheduleRepositoryEloquent extends CoreRepositoryEloquent implements TrainingScheduleRepository
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
        return TrainingSchedule::class;
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
        return TrainingSchedulePresenter::class;
    }

    public function getAll(array $attributes)
    {
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
            if (!empty($attributes['data'])) {
                foreach ($attributes['data'] as $value) {
                    $TrainingSchedule = $this->model->create($value);
                    if (!empty($value['employeeId'])) {
                        $TrainingSchedule->employee()->sync($value['employeeId']);
                    }

                    if (!empty($value['detail'])) {
                        $this->forDetail($value['detail'], $TrainingSchedule);
                    }
                }
            }
            DB::commit();
        } catch (\Throwable $th) {
            dd($th);
            DB::rollBack();
        }

        return $this->parserResult($TrainingSchedule);
    }

    public function forDetail($attributes, $model)
    {
        foreach ($attributes['createRows'] as $valueCreate) {
            $valueCreate['TrainingScheduleId'] = $model->Id;
            $dataDetail = TrainingScheduleDetail::create($valueCreate);
            $dataDetail->employee()->sync($valueCreate['employeeId']);
            $dataDetail->trainer()->sync($valueCreate['trainerId']);
        }

        foreach ($attributes['updateRows'] as $valueUpdate) {
            $dataUpdate = $model->trainingScheduleDetail()->find($valueUpdate['id']);

            if (!is_null($dataUpdate)) {
                $dataUpdate->update($valueUpdate);
            }
        }
    }

    public function updateAll(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $TrainingSchedule = $this->model->find($id);
            dd($TrainingSchedule);
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }
    }
}
