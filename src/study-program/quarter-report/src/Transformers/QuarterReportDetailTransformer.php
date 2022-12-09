<?php

namespace GGPHP\StudyProgram\QuarterReport\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetail;
use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewCommentTransformer;
use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewSubjectTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class QuarterReportDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['quarterReportDetailSubject', 'scriptReviewSubject', 'scriptReviewComment'];

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

    public function includeQuarterReportDetailSubject(QuarterReportDetail $quarterReportDetail)
    {
        return $this->collection($quarterReportDetail->quarterReportDetailSubject, new QuarterReportDetailSubjectTransformer, 'QuarterReportDetailSubject');
    }

    public function includeScriptReviewSubject(QuarterReportDetail $quarterReportDetail)
    {
        if (!is_null($quarterReportDetail->ScriptReviewSubjectId)) {
            return $this->item($quarterReportDetail->scriptReviewSubject, new ScriptReviewSubjectTransformer, 'ScriptReviewSubject');
        } else {
            return null;
        }
    }

    public function includeScriptReviewComment(QuarterReportDetail $quarterReportDetail)
    {
        if (!is_null($quarterReportDetail->ScriptReviewCommentId)) {
            return $this->item($quarterReportDetail->scriptReviewComment, new ScriptReviewCommentTransformer, 'ScriptReviewComment');
        } else {
            return null;
        }
    }
}
