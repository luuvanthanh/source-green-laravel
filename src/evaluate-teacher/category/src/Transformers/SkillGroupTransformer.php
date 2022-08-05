<?php

namespace GGPHP\EvaluateTeacher\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\EvaluateTeacher\Category\Models\SkillGroup;

/**
 * Class PositionLevelTransformer.
 *
 * @package namespace GGPHP\EvaluateTeacher\Category\Transformers;
 */
class SkillGroupTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = ['skillGroupDetail'];

    public function includeSkillGroupDetail(SkillGroup $skillGroup)
    {
        return $this->collection($skillGroup->skillGroupDetail, new SkillGroupDetailTransformer, 'SkillGroupDetail');
    }
}
