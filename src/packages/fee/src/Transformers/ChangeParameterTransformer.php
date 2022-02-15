<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\ChangeParameter;

/**
 * Class ChangeParameterTransformer.
 *
 * @package namespace GGPHP\ChangeParameter\Transformers;
 */
class ChangeParameterTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = ['paymentForm', 'changeParameterDetail'];

    public function customAttributes($model): array
    {
        return [

        ];
    }

    /**
     * Include PaymentForm
     * @param ChangeParameter $changeParameter
     * @return \League\Fractal\Resource\Item
     */
    public function includePaymentForm(ChangeParameter $changeParameter)
    {
        if (empty($changeParameter->paymentForm)) {
            return;
        }

        return $this->item($changeParameter->paymentForm, new PaymentFormTransformer, 'PaymentForm');
    }

    /**
     * Include ChangeParameterDetail
     * @param ChangeParameter $changeParameter
     * @return \League\Fractal\Resource\Item
     */
    public function includeChangeParameterDetail(ChangeParameter $changeParameter)
    {
        return $this->collection($changeParameter->changeParameterDetail, new ChangeParameterDetailTransformer, 'ChangeParameterDetail');
    }
}
