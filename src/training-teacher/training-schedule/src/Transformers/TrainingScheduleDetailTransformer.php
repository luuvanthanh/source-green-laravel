<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingScheduleDetail;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\TrainingSchedule\Transformers;
 */
class TrainingScheduleDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['employee', 'trainer'];

    public function includeEmployee(TrainingScheduleDetail $trainingScheduleDetail)
    {
        return $this->collection($trainingScheduleDetail->employee, new UserTransformer, 'Employee');
    }

    public function includeTrainer(TrainingScheduleDetail $trainingScheduleDetail)
    {
        return $this->collection($trainingScheduleDetail->employee, new UserTransformer, 'trainer');
    }
}
