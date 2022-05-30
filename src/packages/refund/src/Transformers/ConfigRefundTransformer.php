<?php

namespace GGPHP\Refund\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Refund\Models\ConfigRefund;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\Refund\Transformers;
 */
class ConfigRefundTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['refundDetail'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeRefundDetail(ConfigRefund $model)
    {
        if (empty($model->refundDetail)) {
            return null;
        }

        return $this->item($model->refundDetail, new RefundDetailTransformer, 'RefundDetail');
    }
}
