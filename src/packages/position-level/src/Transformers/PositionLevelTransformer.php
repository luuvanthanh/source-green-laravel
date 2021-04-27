<?php

namespace GGPHP\PositionLevel\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Category\Transformers\PositionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class PositionLevelTransformer.
 *
 * @package namespace GGPHP\PositionLevel\Transformers;
 */
class PositionLevelTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['branch', 'position', 'division'];

    protected $availableIncludes = ['employee'];

    /**
     * @param PositionLevel $positionLevel
     * @return mixed
     */
    public function includeEmployee(PositionLevel $positionLevel)
    {
        if (empty($positionLevel->employee)) {
            return;
        }

        return $this->item($positionLevel->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include position
     * @param  PositionLevel $positionLevel
     */
    public function includePosition(PositionLevel $positionLevel)
    {
        if (empty($positionLevel->position)) {
            return;
        }
        return $this->item($positionLevel->position, new PositionTransformer, 'Position');
    }

    /**
     * Include division
     * @param  PositionLevel $positionLevel
     */
    public function includeDivision(PositionLevel $positionLevel)
    {
        if (empty($positionLevel->division)) {
            return;
        }
        return $this->item($positionLevel->division, new DivisionTransformer, 'Division');
    }

    /**
     * Include branch
     * @param  PositionLevel $positionLevel
     */
    public function includeBranch(PositionLevel $positionLevel)
    {
        if (empty($positionLevel->branch)) {
            return;
        }
        return $this->item($positionLevel->branch, new BranchTransformer, 'Branch');
    }

}
