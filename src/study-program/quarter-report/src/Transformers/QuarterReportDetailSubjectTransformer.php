<?php

namespace GGPHP\StudyProgram\QuarterReport\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetailSubject;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetailSubjectChildrens;
use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewSubjectDetailTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class QuarterReportDetailSubjectTransformer extends BaseTransformer
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
    protected $availableIncludes = ['quarterReportDetailSubjectChildren', 'scriptReviewSubjectDetail'];

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

    public function includeQuarterReportDetailSubjectChildren(QuarterReportDetailSubject $quarterReportDetailSubject)
    {
        return $this->collection($quarterReportDetailSubject->quarterReportDetailSubjectChildren, new QuarterReportDetailSubjectChildrenTransformer, 'QuarterReportDetailSubjectChildren');
    }

    public function includeScriptReviewSubjectDetail(QuarterReportDetailSubject $quarterReportDetailSubject)
    {
        if (!is_null($quarterReportDetailSubject->ScriptReviewSubjectDetailId)) {
            return $this->item($quarterReportDetailSubject->scriptReviewSubjectDetail, new ScriptReviewSubjectDetailTransformer, 'ScriptReviewSubjectDetail');
        } else {
            return null;
        }
    }
}
