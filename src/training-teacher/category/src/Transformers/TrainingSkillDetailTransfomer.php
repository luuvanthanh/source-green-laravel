<?php

namespace GGPHP\TrainingTeacher\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\Category\Models\TrainingSkillDetail;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\Category\Transformers;
 */
class TrainingSkillDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['trainingForm', 'trainingSkill'];

    public function customAttributes($model): array
    {
        return [
            'TrainingHuman' => array_search($model->TrainingHuman, TrainingSkillDetail::TRAINING_HUMAN)
        ];
    }

    public function includeTrainingForm(TrainingSkillDetail $trainingSkillDetail)
    {
        if (is_null($trainingSkillDetail->trainingForm)) {
            return null;
        }

        return $this->item($trainingSkillDetail->trainingForm, new TrainingFormTransformer, 'TrainingForm');
    }

    public function includeTrainingSkill(TrainingSkillDetail $trainingSkillDetail)
    {
        return $this->item($trainingSkillDetail->trainingSkill, new TrainingSkillTransformer, 'TrainingSkill');
    }
}
