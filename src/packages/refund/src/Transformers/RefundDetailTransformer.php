<?php

namespace GGPHP\Refund\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\FeeTransformer;
use GGPHP\Refund\Models\RefundDetail;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\Refund\Transformers;
 */
class RefundDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['configRefund', 'fee'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeConfigRefund(RefundDetail $model)
    {
        return $this->collection($model->configRefund, new ConfigRefundTransformer, 'ConfigRefund');
    }

    public function includeFee(RefundDetail $model)
    {
        if (empty($model->fee)) {
            return null;
        }

        return $this->item($model->fee, new FeeTransformer, 'Fee');
    }
}
