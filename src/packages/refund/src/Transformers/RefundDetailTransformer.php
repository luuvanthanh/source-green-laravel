<?php

namespace GGPHP\Refund\Transformers;

use GGPHP\Refund\Models\Refund;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Refund\Models\RefundDetail;
use GGPHP\Users\Transformers\UserTransformer;

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
    protected $availableIncludes = ['configRefund'];

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
}
