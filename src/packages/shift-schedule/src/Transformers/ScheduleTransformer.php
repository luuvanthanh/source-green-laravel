<?php

namespace GGPHP\ShiftSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ShiftSchedule\Models\Schedule;
use GGPHP\Users\Models\User;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ScheduleTransformer.
 *
 * @package namespace GGPHP\ShiftSchedule\Transformers;
 */
class ScheduleTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['scheduleRepeat', 'user', 'scheduleException', 'shift'];

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
    public function includeUser(Schedule $schedule)
    {
        if (empty($schedule->user)) {
            return;
        }
        return $this->item($schedule->user, new UserTransformer, 'User');
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
