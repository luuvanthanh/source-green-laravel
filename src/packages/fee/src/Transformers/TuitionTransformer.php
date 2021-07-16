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
    protected $defaultIncludes = ['paymentForm', 'fee'];

    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include PaymentForm
     * @param Tuition $tuition
     * @return \League\Fractal\Resource\Item
     */
    public function includePaymentForm(Tuition $tuition)
    {
        if (empty($tuition->paymentForm)) {
            return;
        }

        return $this->item($tuition->paymentForm, new PaymentFormTransformer, 'PaymentForm');
    }

    /**
     * Include Fee
     * @param Tuition $tuition
     * @return \League\Fractal\Resource\Item
     */
    public function includeFee(Tuition $tuition)
    {
        if (empty($tuition->fee)) {
            return;
        }

        return $this->item($tuition->fee, new PaymentFormTransformer, 'Fee');
    }
}
