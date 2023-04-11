<?php

namespace GGPHP\InterviewManager\Transformers;

use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\InterviewManager\Models\InterviewConfiguration;
use GGPHP\InterviewManager\Models\InterviewConfigurationEvaluationCriteria;
use GGPHP\InterviewManager\Models\InterviewDetail;
use GGPHP\InterviewManager\Models\InterviewList;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\InterviewManager\Transformers;
 */
class InterviewListTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['division', 'interviewListEmployee', 'interviewConfiguration', 'pointEvaluation', 'interviewDetail'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $data = $this->getAvgEvaluation($model);
        return [
            'Status' => array_search($model->Status, InterviewList::STATUS),
            'evaluationCriteria' => $data
        ];
    }

    public function includeDivision(InterviewList $interviewList)
    {
        if (is_null($interviewList->division)) {
            return null;
        }

        return $this->item($interviewList->division, new DivisionTransformer, 'division');
    }

    public function includeInterviewListEmployee(InterviewList $interviewList)
    {
        return $this->collection($interviewList->interviewListEmployee, new InterviewListEmployeeTransformer, 'InterviewListEmployee');
    }

    public function includeInterviewConfiguration(InterviewList $interviewList)
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

    public function includeInterviewDetail(InterviewList $interviewList)
    {
        return $this->collection($interviewList->interviewDetail, new InterviewDetailTransformer, 'InterviewDetail');
    }

    public function getAvgEvaluation($model)
    {
        $interviewConfigura = InterviewConfigurationEvaluationCriteria::where('InterviewConfigurationId', $model->InterviewConfigurationId)->get()->pluck('EvaluationCriteriaId');
        if (!empty($interviewConfigura)) {
            $sum = 0;
            foreach ($interviewConfigura as $key => $evaluationCriteriaId) {
                $interviewListDetail = InterviewDetail::where('EvaluationCriteriaId', $evaluationCriteriaId)->get()->toArray();
                if (!empty($interviewListDetail)) {
                    foreach ($interviewListDetail as $key => $interviewListDetailEvaluationCriteriaId) {
                        $sum = $sum + $interviewListDetailEvaluationCriteriaId['PointEvaluation'];
                    }
                    $evaluation['evaluationCriteriaId'] = $evaluationCriteriaId;
                    $evaluation['average'] = number_format($sum / count($interviewListDetail), 2);
                    $sum = 0;
                    $data[] = $evaluation;
                }
            }
        }
        
        return $data;
    }
}
