<?php

namespace GGPHP\InterviewManager\Transformers;

use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\InterviewManager\Models\InterviewConfiguration;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\InterviewManager\Transformers;
 */
class InterviewConfigurationTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['division', 'interviewConfigurationEvaluationCriteria', 'interviewer'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeDivision(InterviewConfiguration $interviewConfiguration)
    {
        if (is_null($interviewConfiguration->division)) {
            return null;
        }

        return $this->item($interviewConfiguration->division, new DivisionTransformer, 'division');
    }

    public function includeInterviewConfigurationEvaluationCriteria(InterviewConfiguration $interviewConfiguration)
    {
        return $this->collection($interviewConfiguration->interviewConfigurationEvaluationCriteria, new InterviewConfigurationEvaluationCriteriaTransformer, 'InterviewConfigurationEvaluationCriteria');
    }

    public function includeInterviewer(InterviewConfiguration $interviewConfiguration)
    {
        if (is_null($interviewConfiguration->interviewer)) {
            return null;
        }

        return $this->item($interviewConfiguration->interviewer, new InterviewerTransformer, 'Interviewer');
    }
}
