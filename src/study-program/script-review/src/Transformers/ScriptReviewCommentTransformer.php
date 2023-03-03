<?php

namespace GGPHP\StudyProgram\ScriptReview\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewComment;
use GGPHP\StudyProgram\Setting\Transformers\SampleCommentTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ScriptReviewCommentTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['scriptReviewCommentDetail', 'sampleComment'];

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

    public function includeScriptReviewCommentDetail(ScriptReviewComment $scriptReviewComment)
    {
        return $this->collection($scriptReviewComment->scriptReviewCommentDetail, new ScriptReviewCommentDetailTransformer, 'ScriptReviewCommentDetail');
    }

    public function includeSampleComment(ScriptReviewComment $scriptReviewComment)
    {
        return $this->item($scriptReviewComment->sampleComment, new SampleCommentTransformer, 'SampleComment');
    }
}
