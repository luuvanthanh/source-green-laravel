<?php
namespace GGPHP\ShiftSchedule\Services;

use GGPHP\ShiftSchedule\Models\ScheduleRepeat;

class ScheduleRepeatService
{
    /**
     * Add schedule repeat for schedule
     *
     * @param  Scheduel  $schedule
     * @param  Date  $date
     * @return date  $dayend
     */
    public static function add(array $attributes)
    {
        if (!empty($attributes['ByWeekDay']) && is_array($attributes['ByWeekDay'])) {
            $attributes['ByWeekDay'] = implode(',', $attributes['ByWeekDay']);
        }

        $scheduleRepeat = ScheduleRepeat::create($attributes);

        return $scheduleRepeat;
    }
}
