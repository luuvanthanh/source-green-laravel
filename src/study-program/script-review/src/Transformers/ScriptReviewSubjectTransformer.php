<?php

namespace GGPHP\StudyProgram\ScriptReview\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubject;
use GGPHP\StudyProgram\Setting\Transformers\SubjectTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ScriptReviewSubjectTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['scriptReviewSubjectDetail', 'subject'];

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

    public function includeScriptReviewSubjectDetail(ScriptReviewSubject $scriptReviewSubject)
    {
        return $this->collection($scriptReviewSubject->scriptReviewSubjectDetail, new ScriptReviewSubjectDetailTransformer, 'ScriptReviewSubjectDetail');
    }

    public function includeSubject(ScriptReviewSubject $scriptReviewSubject)
    {
        if (is_null($scriptReviewSubject->subject)) {
            return null;
        }

        return $this->item($scriptReviewSubject->subject, new SubjectTransformer, 'Subject');
    }
}
