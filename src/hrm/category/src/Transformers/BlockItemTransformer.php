<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\Block;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class BlockItemTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class BlockItemTransformer extends BaseTransformer
{
    protected $availableIncludes = [];

    public function customAttributes($model): array
    {
        return [];
    }
}
