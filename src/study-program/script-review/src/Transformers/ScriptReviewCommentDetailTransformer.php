<?php

namespace GGPHP\StudyProgram\ScriptReview\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewCommentDetail;
use GGPHP\StudyProgram\Setting\Transformers\SampleCommentDetailTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ScriptReviewCommentDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['sampleCommentDetail'];

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

    public function includeSampleCommentDetail(ScriptReviewCommentDetail $scriptReviewCommentDetail)
    {
        if (is_null($scriptReviewCommentDetail->sampleCommentDetail)) {
            return null;
        }

        return $this->item($scriptReviewCommentDetail->sampleCommentDetail, new SampleCommentDetailTransformer, 'SampleCommentDetail');
    }
}
