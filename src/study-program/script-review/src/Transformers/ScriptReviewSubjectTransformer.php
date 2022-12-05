<?php

namespace GGPHP\StudyProgram\ScriptReview\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubject;

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
    protected $availableIncludes = ['scriptReviewSubjectDetail'];

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
}
