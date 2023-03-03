<?php

namespace GGPHP\StudyProgram\QuarterReport\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetailSubjectChildren;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetailSubjectChildrens;
use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewSubjectDetailChildrenTransformer;
use GGPHP\StudyProgram\Setting\Transformers\EvaluationCriteriaTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class QuarterReportDetailSubjectChildrenTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['scriptReviewSubjectDetailChildren', 'evaluationCriteria'];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    /**
     * Transform the ReviewDetail entity.
     *
     * @param ReviewChildTeacher 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeScriptReviewSubjectDetailChildren(QuarterReportDetailSubjectChildren $quarterReportDetailSubjectChildren)
    {
        if (is_null($quarterReportDetailSubjectChildren->scriptReviewSubjectDetailChildren)) {
            return null;
        }

        return $this->item($quarterReportDetailSubjectChildren->scriptReviewSubjectDetailChildren, new ScriptReviewSubjectDetailChildrenTransformer, 'ScriptReviewSubjectDetailChildren');
    }

    public function includeEvaluationCriteria(QuarterReportDetailSubjectChildren $quarterReportDetailSubjectChildren)
    {
        if (is_null($quarterReportDetailSubjectChildren->evaluationCriteria)) {
            return null;
        }

        return $this->item($quarterReportDetailSubjectChildren->evaluationCriteria, new EvaluationCriteriaTransformer, 'EvaluationCriteria');
    }
}
