<?php

namespace GGPHP\InterviewManager\Transformers;

use Carbon\Carbon;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\InterviewManager\Models\DoInterview;
use GGPHP\InterviewManager\Models\EvaluationCriteria;
use GGPHP\InterviewManager\Models\InterviewConfiguration;
use GGPHP\InterviewManager\Models\InterviewConfigurationEvaluationCriteria;
use GGPHP\InterviewManager\Models\InterviewDetail;
use GGPHP\InterviewManager\Models\InterviewList;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\InterviewManager\Transformers;
 */
class DoInterviewEvaluationTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

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
}
