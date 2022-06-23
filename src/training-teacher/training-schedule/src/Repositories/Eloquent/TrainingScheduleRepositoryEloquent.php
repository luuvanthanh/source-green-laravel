<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\TrainingTeacher\Category\Repositories\Eloquent\TrainingModuleRepositoryEloquent;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingSchedule;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingScheduleDetail;
use GGPHP\TrainingTeacher\TrainingSchedule\Presenters\TrainingSchedulePresenter;
use GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Contracts\TrainingScheduleRepository;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
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
        UserRepositoryEloquent $userRepositoryEloquent,
        Container $app
    ) {
        parent::__construct($app);
        $this->trainingModuleRepositoryEloquent = $trainingModuleRepositoryEloquent;
        $this->userRepositoryEloquent = $userRepositoryEloquent;
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
        if (!empty($attributes['key'])) {
            $this->trainingModuleRepositoryEloquent->model = $this->trainingModuleRepositoryEloquent->model->whereHas('trainingSchedule.employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['key']);
            })->orWhereHas('trainingSchedule.trainingScheduleDetail.employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['key']);
            })->orWhereHas('trainingSchedule.trainingScheduleDetail.trainer', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['key']);
            });
        }

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
            $dataDetail = $model->trainingScheduleDetail()->find($valueUpdate['id']);

            if (!is_null($dataDetail)) {
                $dataDetail->update($valueUpdate);

                if (!empty($valueUpdate['trainerId'])) {
                    $dataDetail->trainer()->detach();
                    $dataDetail->trainer()->sync($valueUpdate['trainerId']);
                }

                if (!empty($valueUpdate['employeeId'])) {
                    $dataDetail->trainer()->detach();
                    $dataDetail->trainer()->sync($valueUpdate['employeeId']);
                }
            }
        }

        if (!empty($attributes['deleteRows'])) {
            $model->trainingScheduleDetail()->whereIn('Id', $attributes['deleteRows'])->delete();
        }
    }

    /**
     * updateTrainingModule
     *
     * @param  mixed $attributes
     * @param  mixed $id
     * @return void
     */
    public function updateAll(array $attributes, $id)
    {
        $trainingmodule = $this->trainingModuleRepositoryEloquent->model->find($id);
        DB::beginTransaction();
        try {
            if (!empty($attributes['data'])) {
                foreach ($attributes['data'] as $value) {
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

    public function scheduleTeacher(array $attributes)
    {
        $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->whereHas('trainingScheduleDetail', function ($q) use ($attributes) {

            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $q->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
            }

            $q->orderBy('CreationTime', 'DESC');
        })->with(['trainingScheduleDetail' => function ($q01) use ($attributes) {

            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $q01->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
            }

            $q01->orderBy('CreationTime', 'DESC');
        }])->when(!empty($attributes['key']), function ($query01) use ($attributes) {
            $query01->whereLike('FullName', $attributes['key']);
        })->when(!empty($attributes['id']), function ($query02) use ($attributes) {
            $query02->where('Id', $attributes['id']);
        });

        if (!empty($attributes['limit'])) {
            $employee = $this->userRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $employee = $this->userRepositoryEloquent->get();
        }

        return $employee;
    }
}
