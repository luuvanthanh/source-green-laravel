<?php

namespace GGPHP\EvaluateTeacher\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\EvaluateTeacher\Category\Models\EvaluateTypeDetail;

/**
 * Class PositionLevelTransformer.
 *
 * @package namespace GGPHP\EvaluateTeacher\Category\Transformers;
 */
class EvaluateTypeDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = ['ratingLevel', 'skillGroupDetail'];

    public function includeRatingLevel(EvaluateTypeDetail $evaluateTypeDetail)
    {
        return $this->collection($evaluateTypeDetail->ratingLevel, new RatingLevelTransformer, 'RatingLevel');
    }

    public function includeSkillGroupDetail(EvaluateTypeDetail $evaluateTypeDetail)
    {
        if (empty($evaluateTypeDetail->skillGroupDetail)) {
            return;
        }

        return $this->item($evaluateTypeDetail->skillGroupDetail, new SkillGroupDetailTransformer, 'SkillGroupDetail');
    }
}
