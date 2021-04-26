<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Models\User;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\YoungAttendance\ShiftSchedule\Models\Schedule;

/**
 * Class ScheduleTransformer.
 *
 * @package namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;
 */
class ScheduleTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee', 'shift'];
    protected $defaultIncludes = ['scheduleRepeat', 'scheduleException'];

    /**
     * Include ScheduleRepeat
     * @param  Schedule $schedule
     */
    public function includeScheduleRepeat(Schedule $schedule)
    {
        if (empty($schedule->ScheduleRepeat)) {
            return;
        }
        return $this->item($schedule->ScheduleRepeat, new ScheduleRepeatTransformer, 'ScheduleRepeat');
    }

    /**
     * Include User
     * @param  Schedule $schedule
     */
    public function includeEmployee(Schedule $schedule)
    {
        if (empty($schedule->employee)) {
            return;
        }
        return $this->item($schedule->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include ScheduleException
     * @param  Schedule $schedule
     */
    public function includeScheduleException(Schedule $schedule)
    {
        return $this->collection(empty($schedule->scheduleException) ? [] : $schedule->scheduleException, new ScheduleExceptionTransformer, 'ScheduleException');
    }

    /**
     * Include shift
     * @param  Schedule $schedule
     */
    public function includeShift(Schedule $schedule)
    {
        if (empty($schedule->shift)) {
            return;
        }
        return $this->item($schedule->shift, new ShiftTransformer, 'Shift');
    }
}
