<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\CriteriaDetail;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class BlockTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class CriteriaDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = [];

    public function customAttributes($model): array
    {
        return [
            'Level' => array_search($model->Level, CriteriaDetail::LEVEL)
        ];
    }
}
