<?php

namespace GGPHP\StudyProgram\ScriptReview\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubjectDetailChildren;
use GGPHP\StudyProgram\Setting\Transformers\SubjectSectionDetailTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ScriptReviewSubjectDetailChildrenTransformer extends BaseTransformer
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
    protected $availableIncludes = ['subjectSectionDetail'];

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

    public function includeSubjectSectionDetail(ScriptReviewSubjectDetailChildren $scriptReviewSubjectDetailChildren)
    {
        return $this->item($scriptReviewSubjectDetailChildren->subjectSectionDetail, new SubjectSectionDetailTransformer, 'SubjectSectionDetail');
    }
}
