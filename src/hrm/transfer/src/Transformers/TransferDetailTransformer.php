<?php

namespace GGPHP\Transfer\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Category\Transformers\PositionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Transfer\Models\TransferDetail;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class TransferDetailTransformer.
 *
 * @package namespace GGPHP\Transfer\Transformers;
 */
class TransferDetailTransformer extends BaseTransformer
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
     * @param  TransferDetail $transferDetail
     */
    public function includeEmployee(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->employee)) {
            return;
        }

        return $this->item($transferDetail->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include position
     * @param  TransferDetail $transferDetail
     */
    public function includePosition(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->position)) {
            return;
        }

        return $this->item($transferDetail->position, new PositionTransformer, 'Position');
    }

    /**
     * Include division
     * @param  TransferDetail $transferDetail
     */
    public function includeDivision(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->division)) {
            return;
        }

        return $this->item($transferDetail->division, new DivisionTransformer, 'Division');
    }

    /**
     * Include branch
     * @param  TransferDetail $transferDetail
     */
    public function includeBranch(TransferDetail $transferDetail)
    {
        if (empty($transferDetail->branch)) {
            return;
        }

        return $this->item($transferDetail->branch, new BranchTransformer, 'Branch');
    }
}
