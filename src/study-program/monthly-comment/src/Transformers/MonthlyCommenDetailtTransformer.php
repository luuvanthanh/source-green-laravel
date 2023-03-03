<?php

namespace GGPHP\StudyProgram\MonthlyComment\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyCommentDetail;
use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewCommentTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class MonthlyCommentDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['scriptReviewComment', 'monthlyCommentDetailSubject'];

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

    public function includeScriptReviewComment(MonthlyCommentDetail $monthlyCommentDetail)
    {
        if (is_null($monthlyCommentDetail->scriptReviewComment)) {
            return null;
        }

        return $this->item($monthlyCommentDetail->scriptReviewComment, new ScriptReviewCommentTransformer, 'ScriptReviewComment');
    }

    public function includeMonthlyCommentDetailSubject(MonthlyCommentDetail $monthlyCommentDetail)
    {
        return $this->collection($monthlyCommentDetail->monthlyCommentDetailSubject, new MonthlyCommentDetailSubjectTransformer, 'MonthlyCommentDetailSubject');
    }
}
