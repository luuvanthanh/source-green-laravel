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
            $oldScheduleException = ScheduleException::where('ScheduleId', $schedule->Id)->where('Date', $date[$i])->where('ShiftId', $schedule->ShiftId)->first();
            if (is_null($oldScheduleException)) {
                $attributes = [
                    'Date' => $date[$i],
                    'ShiftId' => $schedule->ShiftId,
                    'ScheduleId' => $schedule->Id,
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
        $scheduleException = ScheduleException::where('ScheduleId', $schedulesId)->get();
        foreach ($scheduleException as $value) {
            $listDayException[] = $value->Date->toDateString();
        }

        return $listDayException;
    }
}
