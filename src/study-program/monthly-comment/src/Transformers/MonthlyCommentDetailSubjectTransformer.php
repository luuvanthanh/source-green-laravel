<?php

namespace GGPHP\StudyProgram\MonthlyComment\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyCommentDetailSubject;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyCommentDetailSubjectChildrens;
use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewSubjectDetailTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class MonthlyCommentDetailSubjectTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['monthlyCommentDetailSubjectChildren', 'scriptReviewSubjectDetail', 'monthlyCommentDetailSubjectChildren'];

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

    public function includeQuarterReportDetailSubjectChildren(MonthlyCommentDetailSubject $monthlyCommentDetailSubject)
    {
        return $this->collection($monthlyCommentDetailSubject->quarterReportDetailSubjectChildren, new MonthlyCommentDetailSubjectChildrenTransformer, 'QuarterReportDetailSubjectChildren');
    }

    public function includeScriptReviewSubjectDetail(MonthlyCommentDetailSubject $monthlyCommentDetailSubject)
    {
        if (is_null($monthlyCommentDetailSubject->scriptReviewSubjectDetail)) {
            return null;
        }

        return $this->item($monthlyCommentDetailSubject->scriptReviewSubjectDetail, new ScriptReviewSubjectDetailTransformer, 'ScriptReviewSubjectDetail');
    }

    public function includeMonthlyCommentDetailSubjectChildren(MonthlyCommentDetailSubject $monthlyCommentDetailSubject)
    {
        return $this->collection($monthlyCommentDetailSubject->monthlyCommentDetailSubjectChildren, new MonthlyCommentDetailSubjectChildrenTransformer, 'MonthlyCommentDetailSubjectChildren');
    }
}
