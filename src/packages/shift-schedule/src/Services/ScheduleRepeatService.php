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
        if (!empty($attributes['by_week_day']) && is_array($attributes['by_week_day'])) {
            $attributes['by_week_day'] = implode(",", $attributes['by_week_day']);
        }

        $scheduleRepeat = ScheduleRepeat::create($attributes);

        return $scheduleRepeat;
    }

}
