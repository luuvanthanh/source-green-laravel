<?php

namespace GGPHP\TrainingTeacher\Category\Transformers;

use GGPHP\Clover\Transformers\ItemTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\Category\Models\TrainingModule;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\Category\Transformers;
 */
class TrainingModuleTransformer extends BaseTransformer
{
    protected $availableIncludes = ['item', 'trainingModuleDetail', 'trainingModuleTrainingSkill'];

    public function includeItem(TrainingModule $trainingModule)
    {
        if (is_null($trainingModule->item)) {
            return null;
        }

        return $this->item($trainingModule->item, new ItemTransformer, 'Item');
    }

    public function includeTrainingModuleDetail(TrainingModule $trainingModule)
    {
        return $this->collection($trainingModule->trainingModuleDetail, new TrainingModuleTransformer, 'TrainingModuleDetail');
    }

    public function includeTrainingModuleTrainingSkill(TrainingModule $trainingModule)
    {
        return $this->collection($trainingModule->trainingModuleTrainingSkill, new TrainingSkillTransformer, 'TrainingModuleTrainingSkill');
    }
}
