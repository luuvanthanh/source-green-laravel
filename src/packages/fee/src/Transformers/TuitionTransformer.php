<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\Tuition;

/**
 * Class TuitionTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class TuitionTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [

        ];
    }
}
