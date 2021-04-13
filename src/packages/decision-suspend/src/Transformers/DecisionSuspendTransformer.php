<?php

namespace GGPHP\DecisionSuspend\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\DecisionSuspend\Models\DecisionSuspend;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class DecisionSuspendTransformer.
 *
 * @package namespace GGPHP\DecisionSuspend\Transformers;
 */
class DecisionSuspendTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee'];

    protected $defaultIncludes = [];

    /**
     * Include employee
     * @param  DecisionSuspend $decisionSuspend
     */
    public function includeEmployee(DecisionSuspend $decisionSuspend)
    {
        if (empty($decisionSuspend->employee)) {
            return;
        }

        return $this->item($decisionSuspend->employee, new UserTransformer, 'Employee');
    }
}
