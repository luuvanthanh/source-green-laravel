<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;

use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Models\User;
use GGPHP\YoungAttendance\ShiftSchedule\Models\Schedule;
use GGPHP\YoungAttendance\ShiftSchedule\Transformers\ScheduleRepeatTransformer;

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
    protected $availableIncludes = ['student', 'shift'];
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
    public function includeStudent(Schedule $schedule)
    {
        if (empty($schedule->student)) {
            return;
        }
        return $this->item($schedule->student, new StudentTransformer, 'Student');
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
