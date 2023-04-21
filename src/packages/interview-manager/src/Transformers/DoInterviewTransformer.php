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
class DoInterviewTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['division', 'doInterviewEvaluation', 'interviewConfiguration'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $flag = 'false';
        if (empty($model->mediumScore)) {
            $flag = 'true';
        }
        return [
            'Date' => Carbon::parse($model->Date)->format('d-m-Y'),
            'flag' => $flag
        ];
    }

    public function includeDivision(DoInterview $interviewList)
    {
        if (is_null($interviewList->division)) {
            return null;
        }

        return $this->item($interviewList->division, new DivisionTransformer, 'division');
    }

    public function includeDoInterviewEvaluation(DoInterview $interviewList)
    {
        return $this->collection($interviewList->evaluation, new DoInterviewEvaluationTransformer, 'DoInterviewEvaluation');
    }

    public function includeInterviewConfiguration(DoInterview $interviewList)
    {
        if (is_null($interviewList->interviewConfiguration)) {
            return null;
        }

        return $this->item($interviewList->interviewConfiguration, new InterviewConfigurationTransformer, 'InterviewConfiguration');
    }

    public function includePointEvaluation(InterviewList $interviewList)
    {
        if (is_null($interviewList->PointEvaluation)) {
            return null;
        }

        return $this->item($interviewList->PointEvaluation, new PointEvaluationTransformer, 'PointEvaluation');
    }
}
