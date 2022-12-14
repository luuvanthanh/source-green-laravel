<?php

namespace GGPHP\StudyProgram\ScriptReview\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubjectDetail;
use GGPHP\StudyProgram\Setting\Transformers\SubjectSectionTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ScriptReviewSubjectDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['scriptReviewSubjectDetailChildren', 'subjectSection'];

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

    public function includeScriptReviewSubjectDetailChildren(ScriptReviewSubjectDetail $scriptReviewSubjectDetail)
    {
        return $this->collection($scriptReviewSubjectDetail->scriptReviewSubjectDetailChildren, new ScriptReviewSubjectDetailChildrenTransformer, 'ScriptReviewSubjectDetailChildren');
    }

    public function includeSubjectSection(ScriptReviewSubjectDetail $scriptReviewSubjectDetail)
    {
        return $this->item($scriptReviewSubjectDetail->subjectSection, new SubjectSectionTransformer, 'SubjectSection');
    }
}
