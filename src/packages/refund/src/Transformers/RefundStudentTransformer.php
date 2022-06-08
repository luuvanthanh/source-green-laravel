<?php

namespace GGPHP\Refund\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Refund\Models\RefundStudent;

/**
 * Class RefundStudentTranformer.
 *
 * @package namespace GGPHP\Refund\Transformers;
 */
class RefundStudentTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['refund', 'branch', 'studentRefundDetail'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeRefund(RefundStudent $model)
    {
        if (empty($model->refund)) {
            return null;
        }

        return $this->item($model->refund, new RefundTransformer, 'Refund');
    }

    public function includeBranch(RefundStudent $model)
    {
        if (empty($model->branch)) {
            return null;
        }

        return $this->item($model->branch, new BranchTransformer, 'Branch');
    }

    public function includeStudentRefundDetail(RefundStudent $model)
    {
        return $this->collection($model->studentRefundDetail, new StudentRefundDetailTransformer, 'StudentRefundDetail');
    }
}
