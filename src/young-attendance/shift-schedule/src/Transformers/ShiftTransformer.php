<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\YoungAttendance\ShiftSchedule\Models\Shift;

/**
 * Class ShiftTransformer.
 *
 * @package namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;
 */
class ShiftTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['shiftDetail'];

    protected $availableIncludes = ['branch'];

    /**
     * Include Shift Detail
     * @param  Shift $shift
     */
    public function includeShiftDetail(Shift $shift)
    {
        return $this->collection(empty($shift->shiftDetail) ? [] : $shift->shiftDetail, new ShiftDetailTransformer, 'ShiftDetail');
    }

    /**
     * Include branch
     * @param  Shift $shift
     */
    public function includeBranch(Shift $shift)
    {
        if (empty($shift->branch)) {
            return;
        }
        return $this->item($shift->branch, new BranchTransformer, 'Branch');
    }
}
