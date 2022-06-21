<?php

namespace GGPHP\TrainingTeacher\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\Category\Models\TrainingModuleDetail;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\Category\Transformers;
 */
class TrainingModuleDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['trainingSkillDetail'];

    public function customAttributes($model): array
    {
        return [];
    }

    public function includeTrainingSkillDetail(TrainingModuleDetail $trainingModuleDetail)
    {
        return $this->item($trainingModuleDetail->trainingSkillDetail, new TrainingSkillDetailTransformer, 'TrainingSkillDetail');
    }
}
