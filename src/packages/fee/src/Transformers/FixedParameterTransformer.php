<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\FixedParameter;

/**
 * Class FixedParameterTransformer.
 *
 * @package namespace GGPHP\FixedParameter\Transformers;
 */
class FixedParameterTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = ['paymentForm'];

    public function customAttributes($model): array
    {
        return [

        ];
    }

    /**
     * Include PaymentForm
     * @param FixedParameter $fixedParameter
     * @return \League\Fractal\Resource\Item
     */
    public function includePaymentForm(FixedParameter $fixedParameter)
    {
        if (empty($fixedParameter->paymentForm)) {
            return;
        }

        return $this->item($fixedParameter->paymentForm, new PaymentFormTransformer, 'PaymentForm');
    }
}
