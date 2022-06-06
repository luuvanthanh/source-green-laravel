<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\TrainingTeacher\Category\Repositories\Eloquent\TrainingModuleRepositoryEloquent;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingSchedule;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingScheduleDetail;
use GGPHP\TrainingTeacher\TrainingSchedule\Presenters\TrainingSchedulePresenter;
use GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Contracts\TrainingScheduleRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Illuminate\Container\Container;

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

    public function __construct(
        TrainingModuleRepositoryEloquent $trainingModuleRepositoryEloquent,
        Container $app
    ) {
        parent::__construct($app);
        $this->trainingModuleRepositoryEloquent = $trainingModuleRepositoryEloquent;
    }

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

    /**
     * getAll
     *
     * @param  mixed $attributes
     * @return void
     */
    public function getAll(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $TeacherTrainingBoard = $this->trainingModuleRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $TeacherTrainingBoard = $this->trainingModuleRepositoryEloquent->get();
        }

        return $TeacherTrainingBoard;
    }

    /**
     * createAll
     *
     * @param  mixed $attributes
     * @return void
     */
    public function createAll(array $attributes)
    {
        DB::beginTransaction();
        try {
            if (!empty($attributes['data'])) {
                foreach ($attributes['data'] as $value) {
                    $trainingSchedule = $this->model->create($value);
                    if (!empty($value['employeeId'])) {
                        $trainingSchedule->employee()->sync($value['employeeId']);
                    }

                    if (!empty($value['detail'])) {
                        $this->forDetail($value['detail'], $trainingSchedule);
                    }
                }
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }

        return $this->parserResult($trainingSchedule);
    }

    /**
     * forDetail
     *
     * @param  mixed $attributes
     * @param  mixed $model
     * @return void
     */
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
            dd($dataUpdate);

            if (!is_null($dataUpdate)) {
                $dataUpdate->update($valueUpdate);
            }
        }
    }

    public function updateTrainingModule(array $attributes, $id)
    {
        $trainingmodule = $this->trainingModuleRepositoryEloquent->model->find($id);
        DB::beginTransaction();
        try {
            if (!empty($attributes['data'])) {
                foreach ($attributes['data'] as $key => $value) {
                    $trainingSchedule = $trainingmodule->trainingschedule()->find($value['id']);
                    $trainingSchedule->update($value);

                    if (!empty($value['employeeId'])) {
                        $trainingSchedule->employee()->detach();
                        $trainingSchedule->employee()->sync($value['employeeId']);
                    }

                    if (!empty($value['detail'])) {
                        $this->forDetail($value['detail'], $trainingSchedule);
                    }
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }

        return $this->parserResult($trainingmodule);
    }
}
