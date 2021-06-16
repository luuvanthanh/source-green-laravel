<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\SchoolYearInformation;

/**
 * Class SchoolYearInformationTransformer.
 *
 * @package namespace GGPHP\SchoolYearInformation\Transformers;
 */
class SchoolYearInformationTransformer extends BaseTransformer
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
     * @param SchoolYearInformation $schoolYearInformation
     * @return \League\Fractal\Resource\Item
     */
    public function includePaymentForm(SchoolYearInformation $schoolYearInformation)
    {
        if (empty($schoolYearInformation->paymentForm)) {
            return;
        }

        return $this->item($schoolYearInformation->paymentForm, new PaymentFormTransformer, 'PaymentForm');
    }
}
