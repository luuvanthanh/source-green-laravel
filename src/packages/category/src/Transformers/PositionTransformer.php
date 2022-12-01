<?php

namespace GGPHP\Category\Transformers;

use GGPHP\ActivityLog\Traits\ActivityLogTransformerTrait;
use GGPHP\ActivityLog\Transformers\ActivityLogTransformer;
use GGPHP\Category\Models\Position;
use GGPHP\Category\Transformers\PositionSeasonTransformer;
use GGPHP\Category\Transformers\QuotaWorkTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\RolePermission\Transformers\PermissionTransformer;

/**
 * Class PositionTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class PositionTransformer extends BaseTransformer
{
    use ActivityLogTransformerTrait;
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['positionSeason', 'quotaWork', 'permissions', 'logActivity'];

    /**
     * Include position
     * @param  Position $position
     */
    public function includePositionSeason(Position $position)
    {

        return $this->collection($position->positionSeason, new PositionSeasonTransformer, 'PositionSeason');
    }

    /**
     * Include quotaWork
     * @param  Position $position
     */
    public function includeQuotaWork(Position $position)
    {

        return $this->collection($position->quotaWorks, new QuotaWorkTransformer, 'QuotaWork');
    }

    /**
     * Include quotaWork
     * @param  Position $position
     */
    public function includePermissions(Position $position)
    {
        return $this->collection($position->permissions, new PermissionTransformer, 'Permission');
    }
}
