<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\Branch;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\ChargeOldStudentTransformer;
use GGPHP\Refund\Transformers\RefundStudentTransformer;

/**
 * Class BranchTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class BranchTransformer extends BaseTransformer
{
    public function customAttributes($model): array
    {
        return [
            'students' => $model->students,
            'totalFeePaidByBranch' => $model->totalFeePaidByBranch,
            'totalFeeStudiedByBranch' => $model->totalFeeStudiedByBranch,
            'totalFeeRefundByBranch' => $model->totalFeeRefundByBranch,
        ];
    }
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = ['chargeOldStudent', 'refundStudent'];

    public function includeChargeOldStudent(Branch $model)
    {
        return $this->collection($model->chargeOldStudent, new ChargeOldStudentTransformer, 'ChargeOldStudent');
    }

    public function includeRefundStudent(Branch $model)
    {
        return $this->collection($model->refundStudent, new RefundStudentTransformer, 'RefundStudent');
    }
}
