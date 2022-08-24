<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\Criteria;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Category\Transformers\CriteriaDetailTransformer;

/**
 * Class BlockTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class CriteriaTransformer extends BaseTransformer
{
    protected $availableIncludes = ['criteriaDetail'];

    public function includeCriteriaDetail(Criteria $criteria)
    {
        return $this->collection($criteria->criteriaDetail, new CriteriaDetailTransformer, 'CriteriaDetail');
    }
}
