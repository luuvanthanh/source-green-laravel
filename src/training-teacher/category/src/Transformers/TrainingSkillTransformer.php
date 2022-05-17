<?php

namespace GGPHP\TrainingTeacher\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\Category\Models\TrainingSkill;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\Category\Transformers;
 */
class TrainingSkillTransformer extends BaseTransformer
{
    protected $availableIncludes = ['trainingSkillDetail'];

    public function includeTrainingSkillDetail(TrainingSkill $trainingSkill)
    {
        return $this->collection($trainingSkill->trainingSkillDetail, new TrainingSkillDetailTransformer, 'TrainingSkillDetail');
    }
}
