<?php

namespace GGPHP\Appoint\Transformers;

use GGPHP\Appoint\Models\AppointDetail;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Category\Transformers\PositionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class AppointDetailTransformer.
 *
 * @package namespace GGPHP\Appoint\Transformers;
 */
class AppointDetailTransformer extends BaseTransformer
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
     * @param  AppointDetail $appointDetail
     */
    public function includeEmployee(AppointDetail $appointDetail)
    {
        if (empty($appointDetail->employee)) {
            return;
        }

        return $this->item($appointDetail->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include position
     * @param  AppointDetail $appointDetail
     */
    public function includePosition(AppointDetail $appointDetail)
    {
        if (empty($appointDetail->position)) {
            return;
        }

        return $this->item($appointDetail->position, new PositionTransformer, 'Position');
    }

    /**
     * Include division
     * @param  AppointDetail $appointDetail
     */
    public function includeDivision(AppointDetail $appointDetail)
    {
        if (empty($appointDetail->division)) {
            return;
        }

        return $this->item($appointDetail->division, new DivisionTransformer, 'Division');
    }

    /**
     * Include branch
     * @param  AppointDetail $appointDetail
     */
    public function includeBranch(AppointDetail $appointDetail)
    {
        if (empty($appointDetail->branch)) {
            return;
        }

        return $this->item($appointDetail->branch, new BranchTransformer, 'Branch');
    }
}
