<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\Grade;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class GradeTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class GradeTransformer extends BaseTransformer
{
    protected $availableIncludes = ['gradeDetail'];

    public function customAttributes($model): array
    {
        return [];
    }

    public function includeGradeDetail(Grade $grade)
    {
        return $this->collection($grade->gradeDetail, new GradeDetailTransformer, 'GradeDetail');
    }
}
