<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\OtherMoneyDetail;

/**
 * Class OtherMoneyDetailTransformer.
 *
 * @package namespace GGPHP\OtherMoneyDetail\Transformers;
 */
class OtherMoneyDetailTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = ['paymentForm', 'classType'];

    public function customAttributes($model): array
    {
        return [

        ];
    }

    /**
     * Include PaymentForm
     * @param OtherMoneyDetail $otherMoneyDetail
     * @return \League\Fractal\Resource\Item
     */
    public function includePaymentForm(OtherMoneyDetail $otherMoneyDetail)
    {
        if (empty($otherMoneyDetail->paymentForm)) {
            return;
        }

        return $this->item($otherMoneyDetail->paymentForm, new PaymentFormTransformer, 'PaymentForm');
    }

    /**
     * Include ClassType
     * @param OtherMoneyDetail $otherMoneyDetail
     * @return \League\Fractal\Resource\Item
     */
    public function includeClassType(OtherMoneyDetail $otherMoneyDetail)
    {
        if (empty($otherMoneyDetail->classType)) {
            return;
        }

        return $this->item($otherMoneyDetail->classType, new ClassTypeTransformer, 'ClassType');
    }
}
