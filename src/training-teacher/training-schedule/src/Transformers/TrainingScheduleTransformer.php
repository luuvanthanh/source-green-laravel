<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\Category\Transformers\TrainingModuleDetailTransformer;
use GGPHP\TrainingTeacher\Category\Transformers\TrainingModuleTransformer;
use GGPHP\TrainingTeacher\TrainingSchedule\Models\TrainingSchedule;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\TrainingSchedule\Transformers;
 */
class TrainingScheduleTransformer extends BaseTransformer
{
    protected $availableIncludes = ['trainingScheduleDetail', 'employee', 'trainingModule', 'trainingModuleDetail'];

    public function includeTrainingScheduleDetail(TrainingSchedule $trainingSchedule)
    {
        return $this->collection($trainingSchedule->trainingScheduleDetail, new TrainingScheduleDetailTransformer, 'TrainingScheduleDetail');
    }

    public function includeEmployee(TrainingSchedule $trainingSchedule)
    {
        return $this->collection($trainingSchedule->employee, new UserTransformer, 'Employee');
    }

    public function includeTrainingModule(TrainingSchedule $trainingSchedule)
    {
        if (is_null($trainingSchedule->trainingModule)) {
            return null;
        }

        return $this->item($trainingSchedule->trainingModule, new TrainingModuleTransformer, 'TrainingModule');
    }

    public function includeTrainingModuleDetail(TrainingSchedule $trainingSchedule)
    {
        if (is_null($trainingSchedule->trainingModuleDetail)) {
            return null;
        }

        return $this->item($trainingSchedule->trainingModuleDetail, new TrainingModuleDetailTransformer, 'TrainingModuleDetail');
    }
}
