<?php

namespace GGPHP\Refund\Transformers;

use GGPHP\Refund\Models\Refund;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\Refund\Transformers;
 */
class RefundTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['schoolYear', 'refundDetail'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeSchoolYear(Refund $model)
    {
        if (empty($model->schoolYear)) {
            return null;
        }

        return $this->item($model->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

    public function includeRefundDetail(Refund $model)
    {
        return $this->collection($model->refundDetail, new RefundDetailTransformer, 'RefundDetail');
    }
}
