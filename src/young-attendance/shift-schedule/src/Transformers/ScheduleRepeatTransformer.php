<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\YoungAttendance\ShiftSchedule\Models\ScheduleRepeat;

/**
 * Class ScheduleRepeatTransformer.
 *
 * @package namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;
 */
class ScheduleRepeatTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

}
