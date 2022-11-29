<?php

namespace GGPHP\StudyProgram\Setting\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\Setting\Models\SubjectSection;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class SubjectSectionTransformer extends BaseTransformer
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

    public function includeSubjectSectionDetail(SubjectSection $subjectSection)
    {
        return $this->collection($subjectSection->subjectSectionDetail, new SubjectSectionDetailTransformer, 'SubjectSectionDetail');
    }
}
