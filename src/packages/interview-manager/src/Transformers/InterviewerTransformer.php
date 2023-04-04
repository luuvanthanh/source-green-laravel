<?php

namespace GGPHP\InterviewManager\Transformers;

use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\InterviewManager\Models\Refund;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\InterviewManager\Models\Interviewer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\InterviewManager\Transformers;
 */
class InterviewerTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['division', 'interviewerEmployee'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeDivision(Interviewer $interviewer)
    {
        if (is_null($interviewer->division)) {
            return null;
        }

        return $this->item($interviewer->division, new DivisionTransformer, 'division');
    }

    public function includeInterviewerEmployee(Interviewer $interviewer)
    {
        return $this->collection($interviewer->interviewerEmployee, new InterviewerEmployeeTransformer, 'InterviewerEmployee');
    }
}
