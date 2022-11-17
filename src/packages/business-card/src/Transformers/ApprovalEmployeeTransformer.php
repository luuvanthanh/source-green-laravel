<?php

namespace GGPHP\BusinessCard\Transformers;

use GGPHP\BusinessCard\Models\ApprovalEmployee;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class BusinessCardDetailTransformer.
 *
 * @package namespace GGPHP\BusinessCard\Transformers;
 */
class ApprovalEmployeeTransformer extends BaseTransformer
{
    protected $availableIncludes = ['employee'];

    public function includeEmployee(ApprovalEmployee $approvalEmployee)
    {
        if (empty($approvalEmployee->employee)) {
            return null;
        }

        return $this->item($approvalEmployee->employee, new UserTransformer, 'Employee');
    }
}
