<?php

namespace GGPHP\EvaluateTeacher\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\EvaluateTeacher\Category\Models\EvaluateType;

/**
 * Class PositionLevelTransformer.
 *
 * @package namespace GGPHP\EvaluateTeacher\Category\Transformers;
 */
class EvaluateTypeTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = ['evaluateTypeDetail', 'skillGroup'];

    public function includeEvaluateTypeDetail(EvaluateType $evaluateType)
    {
        return $this->collection($evaluateType->evaluateTypeDetail, new EvaluateTypeDetailTransformer, 'EvaluateTypeDetail');
    }

    public function includeSkillGroup(EvaluateType $evaluateType)
    {
        return $this->collection($evaluateType->skillGroup, new SkillGroupTransformer, 'SkillGroup');
    }
}
