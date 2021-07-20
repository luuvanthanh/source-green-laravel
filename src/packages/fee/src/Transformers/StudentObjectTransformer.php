<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\StudentObject;

/**
 * Class StudentObjectTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class StudentObjectTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [

        ];
    }
}
