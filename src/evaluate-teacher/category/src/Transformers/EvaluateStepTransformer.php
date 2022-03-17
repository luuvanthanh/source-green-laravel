<?php

namespace GGPHP\EvaluateTeacher\Category\Transformers;

use GGPHP\EvaluateTeacher\Category\Models\EvaluateStep;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class EvaluateStepTransformer.
 *
 * @package namespace GGPHP\EvaluateTeacher\Category\Transformers;
 */
class EvaluateStepTransformer extends BaseTransformer
{
    protected $availableIncludes = ['evaluateType'];

    public function includeEvaluateType(EvaluateStep $evaluateStep)
    {
        return $this->collection($evaluateStep->evaluateType, new EvaluateTypeTransformer, 'EvaluateType');
    }
}
