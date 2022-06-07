<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingSchedule;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\TrainingSchedule\Transformers;
 */
class TrainingScheduleTransformer extends BaseTransformer
{
    protected $availableIncludes = ['trainingScheduleDetail', 'employee'];

    public function includeTrainingScheduleDetail(TrainingSchedule $trainingSchedule)
    {
        return $this->collection($trainingSchedule->trainingScheduleDetail, new TrainingScheduleDetailTransformer, 'TrainingScheduleDetail');
    }

    public function includeEmployee(TrainingSchedule $trainingSchedule)
    {
        return $this->collection($trainingSchedule->employee, new UserTransformer, 'Employee');
    }
}
