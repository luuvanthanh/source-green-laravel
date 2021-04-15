<?php

namespace GGPHP\RevokeShift\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\RevokeShift\Models\RevokeShift;
use GGPHP\ShiftSchedule\Transformers\ShiftTransformer;
use GGPHP\Timekeeping\Transformers\TimekeepingTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class RevokeShiftTransformer.
 *
 * @package namespace GGPHP\RevokeShift\Transformers;
 */
class RevokeShiftTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee', 'shift', 'timekeeping'];

    /**
     * Include employee
     * @param RevokeShift $revokeShift
     * @return \League\Fractal\Resource\Item
     */
    public function includeUser(RevokeShift $revokeShift)
    {
        if (empty($revokeShift->employee)) {
            return;
        }

        return $this->item($revokeShift->employee, new UserTransformer, 'User');
    }

    /**
     * Include employee
     * @param RevokeShift $revokeShift
     * @return \League\Fractal\Resource\Item
     */
    public function includeShift(RevokeShift $revokeShift)
    {
        if (empty($revokeShift->shift)) {
            return;
        }

        return $this->item($revokeShift->shift, new ShiftTransformer, 'Shift');
    }

    /**
     * Include Store
     * @param LateEarly $lateEarly
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTimekeeping(RevokeShift $revokeShift)
    {
        return $this->collection($revokeShift->timekeeping ?? [], new TimekeepingTransformer(), 'Timekeeping');
    }

}
