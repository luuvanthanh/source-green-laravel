<?php

namespace GGPHP\EvaluateTeacher\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\EvaluateTeacher\Category\Models\SkillGroupDetail;

/**
 * Class PositionLevelTransformer.
 *
 * @package namespace GGPHP\EvaluateTeacher\Category\Transformers;
 */
class SkillGroupDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = ['skillGroup'];

    public function includeAbsentType(SkillGroupDetail $skillGroupDetail)
    {
        if (empty($skillGroupDetail->skillGroup)) {
            return;
        }

        return $this->item($skillGroupDetail->skillGroup, new SkillGroupTransformer, 'SkillGroup');
    }
}
