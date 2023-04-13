<?php

namespace GGPHP\InterviewManager\Transformers;

use GGPHP\InterviewManager\Transformers\PointEvaluationTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\InterviewManager\Models\InterviewDetail;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\InterviewManager\Transformers;
 */
class InterviewDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['pointEvaluation'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
        ];
    }

    public function includePointEvaluation(InterviewDetail $interviewDetail)
    {
        if (is_null($interviewDetail->pointEvaluation)) {
            return null;
        }

        return $this->item($interviewDetail->pointEvaluation, new PointEvaluationTransformer, 'pointEvaluetion');
    }
}
