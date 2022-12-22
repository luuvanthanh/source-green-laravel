<?php

namespace GGPHP\StudyProgram\Setting\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\Setting\Models\Subject;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class SubjectTransformer extends BaseTransformer
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
    protected $availableIncludes = ['subjectSection'];

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

    public function includeSubjectSection(Subject $subject)
    {
        return $this->collection($subject->subjectSection, new SubjectSectionTransformer, 'SubjectSection');
    }
}
