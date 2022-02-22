<?php

namespace GGPHP\ShiftSchedule\Transformers;

use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ShiftSchedule\Models\DivisionShift;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class DivisionShiftTransformer.
 *
 * @package namespace GGPHP\DivisionShiftSchedule\Transformers;
 */
class DivisionShiftTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['employeeCreate', 'shift', 'division'];

    protected $availableIncludes = [];

    /**
     * Include User
     * @param  DivisionShift $divisionShift
     */
    public function includeEmployeeCreate(DivisionShift $divisionShift)
    {
        if (empty($divisionShift->employeeCreate)) {
            return;
        }

        return $this->item($divisionShift->employeeCreate, new UserTransformer, 'EmployeeCreate');
    }

    /**
     * Include User
     * @param  DivisionShift $divisionShift
     */
    public function includeShift(DivisionShift $divisionShift)
    {
        if (empty($divisionShift->shift)) {
            return;
        }
        return $this->item($divisionShift->shift, new ShiftTransformer, 'Shift');
    }

    /**
     * Include User
     * @param  DivisionShift $divisionShift
     */
    public function includeDivision(DivisionShift $divisionShift)
    {
        if (empty($divisionShift->division)) {
            return;
        }
        return $this->item($divisionShift->division, new DivisionTransformer, 'Division');
    }
}
