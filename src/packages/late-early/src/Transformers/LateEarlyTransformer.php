<?php

namespace GGPHP\LateEarly\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\Timekeeping\Transformers\TimekeepingTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class LateEarlyTransformer.
 *
 * @package namespace App\Transformers;
 */
class LateEarlyTransformer extends BaseTransformer
{

    protected $defaultIncludes = ['lateEarlyConfig'];
    protected $availableIncludes = ['employee', 'timekeeping'];

    /**
     * Include AbsentType
     * @param LateEarly $lateEarly
     * @return \League\Fractal\Resource\Item
     */
    public function includeUser(LateEarly $lateEarly)
    {
        if (empty($lateEarly->employee)) {
            return;
        }

        return $this->item($lateEarly->employee, new UserTransformer, 'User');
    }

    /**
     * Include Store
     * @param LateEarly $lateEarly
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTimekeeping(LateEarly $lateEarly)
    {
        return $this->collection($lateEarly->timekeeping, new TimekeepingTransformer, 'Timekeeping');
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

        return $this->item($lateEarly->lateEarlyConfig, new LateEarlyConfigTransformer, 'LateEarlyConfig');
    }
}
