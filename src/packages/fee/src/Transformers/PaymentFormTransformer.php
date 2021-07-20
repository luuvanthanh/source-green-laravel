<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\PaymentForm;

/**
 * Class PaymentFormTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class PaymentFormTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [

        ];
    }
}
