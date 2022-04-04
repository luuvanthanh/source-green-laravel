<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ClassTypeTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class MoneyBusTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [];
    }
}
