<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\YoungAttendance\ShiftSchedule\Models\ScheduleException;

/**
 * Class ScheduleExceptionTransformer.
 *
 * @package namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;
 */
class ScheduleExceptionTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];
}
