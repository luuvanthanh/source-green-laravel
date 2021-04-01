<?php
namespace GGPHP\ShiftSchedule\Services;

use GGPHP\ShiftSchedule\Models\ScheduleException;

class ScheduleExceptionService
{
    /**
     * Add exception for schedule
     *
     * @param  Scheduel  $schedule
     * @param  Date  $date
     * @return date  $dayend
     */
    public static function add($schedule, $date)
    {
        for ($i = 0; $i < count($date); $i++) {
            $oldScheduleException = ScheduleException::where('schedule_id', $schedule->id)->where('date', $date[$i])->where('shift_id', $schedule->shift_id)->first();
            if (is_null($oldScheduleException)) {
                $attributes = [
                    'date' => $date[$i],
                    'shift_id' => $schedule->shift_id,
                    'schedule_id' => $schedule->id,
                ];
                $scheduleException = ScheduleException::create($attributes);
            }
        }

        return $scheduleException;
    }

    /**
     * Get day exception for schedule
     *
     * @param  Scheduel  $schedule
     * @param  Date  $date
     * @return date  $dayend
     */
    public static function getDayException($schedulesId)
    {
        $listDayException = [];
        $scheduleException = ScheduleException::where('schedule_id', $schedulesId)->get();
        foreach ($scheduleException as $value) {
            $listDayException[] = $value->date->toDateString();
        }

        return $listDayException;
    }
}
