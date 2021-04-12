<?php

namespace GGPHP\Dismissed\Transformers;

use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Category\Transformers\PositionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Dismissed\Models\DismissedDetail;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class DismissedDetailTransformer.
 *
 * @package namespace GGPHP\Dismissed\Transformers;
 */
class DismissedDetailTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    protected $defaultIncludes = ['employee', 'position', 'division', 'branch'];

    /**
     * Include employee
     * @param  DismissedDetail $dismissedDetail
     */
    public function includeEmployee(DismissedDetail $dismissedDetail)
    {
        if (empty($dismissedDetail->employee)) {
            return;
        }

        return $this->item($dismissedDetail->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include position
     * @param  DismissedDetail $dismissedDetail
     */
    public function includePosition(DismissedDetail $dismissedDetail)
    {
        if (empty($dismissedDetail->position)) {
            return;
        }

        return $this->item($dismissedDetail->position, new PositionTransformer, 'Position');
    }

    /**
     * Include division
     * @param  DismissedDetail $dismissedDetail
     */
    public function includeDivision(DismissedDetail $dismissedDetail)
    {
        if (empty($dismissedDetail->division)) {
            return;
        }

        return $this->item($dismissedDetail->division, new DivisionTransformer, 'Division');
    }

    /**
     * Include branch
     * @param  DismissedDetail $dismissedDetail
     */
    public function includeBranch(DismissedDetail $dismissedDetail)
    {
        if (empty($dismissedDetail->branch)) {
            return;
        }

        return $this->item($dismissedDetail->branch, new BranchTransformer, 'Branch');
    }
}
