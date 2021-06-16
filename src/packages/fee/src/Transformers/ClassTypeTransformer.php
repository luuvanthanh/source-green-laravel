<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\ClassType;

/**
 * Class ClassTypeTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class ClassTypeTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [

        ];
    }
}
