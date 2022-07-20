<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\GradeDetail;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class GradeTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class GradeDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['criteria'];

    public function customAttributes($model): array
    {
        return [
            'Level' => array_search($model->Level, GradeDetail::LEVEL)
        ];
    }

    public function includeCriteria(GradeDetail $gradeDetail)
    {
        return $this->item($gradeDetail->criteria, new CriteriaTransformer, 'Criteria');
    }
}
