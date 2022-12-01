<?php

namespace GGPHP\StudyProgram\Setting\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\Setting\Models\SampleComment;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class SampleCommentTransformer extends BaseTransformer
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
    protected $availableIncludes = ['sampleCommentDetail'];

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

    public function includeSampleCommentDetail(SampleComment $sampleComment)
    {
        return $this->collection($sampleComment->sampleCommentDetail, new SampleCommentDetailTransformer, 'SampleCommentDetail');
    }
}
