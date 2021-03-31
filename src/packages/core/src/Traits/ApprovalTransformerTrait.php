<?php

namespace GGPHP\Core\Traits;

use GGPHP\Approval\Transformers\ApprovalTransformer;

trait ApprovalTransformerTrait
{
    /**
     * Include approval
     * @param $approvalRequest
     * @return \League\Fractal\Resource\Collection
     */
    public function includeApproval($model)
    {
        if (!$model->approvalRequest) {
            return;
        }
        return $this->item($model->approvalRequest, new ApprovalTransformer, 'Approval');
    }
}
