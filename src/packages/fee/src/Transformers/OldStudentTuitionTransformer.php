<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\OldStudentTuition;

/**
 * Class OldStudentTuitionTransformer.
 *
 * @package namespace GGPHP\OldStudentTuition\Transformers;
 */
class OldStudentTuitionTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = ['paymentForm', 'fee'];

    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include PaymentForm
     * @param OldStudentTuition $oldStudentTuition
     * @return \League\Fractal\Resource\Item
     */
    public function includePaymentForm(OldStudentTuition $oldStudentTuition)
    {
        if (empty($oldStudentTuition->paymentForm)) {
            return;
        }

        return $this->item($oldStudentTuition->paymentForm, new PaymentFormTransformer, 'PaymentForm');
    }

    /**
     * Include Fee
     * @param OldStudentTuition $oldStudentTuition
     * @return \League\Fractal\Resource\Item
     */
    public function includeFee(OldStudentTuition $oldStudentTuition)
    {
        if (empty($oldStudentTuition->fee)) {
            return;
        }

        return $this->item($oldStudentTuition->fee, new PaymentFormTransformer, 'Fee');
    }
}
