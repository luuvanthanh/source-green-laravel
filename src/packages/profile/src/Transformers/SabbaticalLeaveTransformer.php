<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Profile\Models\SabbaticalLeave;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class WorkHistoryTransformer.
 *
 * @package namespace App\Transformers;
 */
class SabbaticalLeaveTransformer extends BaseTransformer
{
    protected $defaultIncludes = ['employee'];

    /**
     * @param SabbaticalLeave $sabbaticalLeave
     * @return mixed
     */
    public function includeEmployee(SabbaticalLeave $sabbaticalLeave)
    {
        if (empty($sabbaticalLeave->employee)) {
            return;
        }

        return $this->item($sabbaticalLeave->employee, new UserTransformer, 'Employee');
    }
}
