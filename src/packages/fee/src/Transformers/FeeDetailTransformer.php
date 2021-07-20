<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\FeeDetail;

/**
 * Class FeeDetailTransformer.
 *
 * @package namespace GGPHP\FeeDetail\Transformers;
 */
class FeeDetailTransformer extends BaseTransformer
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
     * @param FeeDetail $feeDetail
     * @return \League\Fractal\Resource\Item
     */
    public function includePaymentForm(FeeDetail $feeDetail)
    {
        if (empty($feeDetail->paymentForm)) {
            return;
        }

        return $this->item($feeDetail->paymentForm, new PaymentFormTransformer, 'PaymentForm');
    }

    /**
     * Include ClassType
     * @param FeeDetail $feeDetail
     * @return \League\Fractal\Resource\Item
     */
    public function includeClassType(FeeDetail $feeDetail)
    {
        if (empty($feeDetail->classType)) {
            return;
        }

        return $this->item($feeDetail->classType, new ClassTypeTransformer, 'ClassType');
    }
}
