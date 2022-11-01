<?php

namespace GGPHP\WorkHour\Transformers;

use GGPHP\Absent\Transformers\AbsentTypeTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\WorkHour\Models\ApprovalEmployeeWorkHour;

/**
 * Class WorkHourTransformer.
 *
 * @package namespace GGPHP\WorkHour\Transformers;
 */
class ApprovalEmployeeWorkHourTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee'];


    /**
     * Include User
     * @param  WorkHour $workHour
     */
    public function includeEmployee(ApprovalEmployeeWorkHour $approvalEmployeeWorkHour)
    {
        if (empty($approvalEmployeeWorkHour->employee)) {
            return;
        }

        return $this->item($approvalEmployeeWorkHour->employee, new UserTransformer, 'Employee');
    }
}
