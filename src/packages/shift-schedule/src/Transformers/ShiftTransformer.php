<?php

namespace GGPHP\ShiftSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ShiftSchedule\Models\Shift;

/**
 * Class ShiftTransformer.
 *
 * @package namespace GGPHP\ShiftSchedule\Transformers;
 */
class ShiftTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['shiftDetail'];

    protected $availableIncludes = [];

    /**
     * Include Shift Detail
     * @param  Shift $shift
     */
    public function includeShiftDetail(Shift $shift)
    {
        return $this->collection(empty($shift->shiftDetail) ? [] : $shift->shiftDetail, new ShiftDetailTransformer, 'ShiftDetail');
    }
}
