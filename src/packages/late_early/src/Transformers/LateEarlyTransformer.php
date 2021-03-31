<?php

namespace GGPHP\LateEarly\Transformers;

use GGPHP\Core\Traits\ApprovalTransformerTrait;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\RolePermission\Transformers\StoreTransformer;
use GGPHP\Timekeeping\Transformers\TimekeepingTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class LateEarlyTransformer extends BaseTransformer
{
    use ApprovalTransformerTrait;

    protected $defaultIncludes = ['approve', 'lateEarlyConfig', 'approval'];
    protected $availableIncludes = ['user', 'timekeeping', 'workStore'];

    /**
     * Include AbsentType
     * @param LateEarly $lateEarly
     * @return \League\Fractal\Resource\Item
     */
    public function includeUser(LateEarly $lateEarly)
    {
        if (empty($lateEarly->user)) {
            return;
        }

        return $this->item($lateEarly->user, new UserTransformer(), 'User');
    }

    /**
     * Include AbsentType
     * @param LateEarly $lateEarly
     * @return \League\Fractal\Resource\Item
     */
    public function includeWorkStore(LateEarly $lateEarly)
    {
        if (empty($lateEarly->workStore)) {
            return;
        }

        return $this->item($lateEarly->workStore, new StoreTransformer, 'WorkStore');
    }

    /**
     * Include Store
     * @param LateEarly $lateEarly
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTimekeeping(LateEarly $lateEarly)
    {
        return $this->collection($lateEarly->timekeeping ?? [], new TimekeepingTransformer(), 'Timekeeping');
    }

    /**
     * Include User Approve
     * @param LateEarly $lateEarly
     * @return \League\Fractal\Resource\Item
     */
    public function includeApprove(LateEarly $lateEarly)
    {
        if (empty($lateEarly->approve)) {
            return;
        }

        return $this->item($lateEarly->approve, new UserTransformer(), 'Approve');
    }

    /**
     * Include User Approve
     * @param LateEarly $lateEarly
     * @return \League\Fractal\Resource\Item
     */
    public function includeLateEarlyConfig(LateEarly $lateEarly)
    {
        if (empty($lateEarly->lateEarlyConfig)) {
            return;
        }

        return $this->item($lateEarly->lateEarlyConfig, new LateEarlyConfigTransformer(), 'LateEarlyConfig');
    }
}
