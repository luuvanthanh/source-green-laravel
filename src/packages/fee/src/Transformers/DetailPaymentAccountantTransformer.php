<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\Fee;

/**
 * Class FeeTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class DetailPaymentAccountantTransformer extends BaseTransformer
{
    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [];
    }
}
