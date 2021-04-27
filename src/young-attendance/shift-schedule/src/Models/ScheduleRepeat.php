<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Models;

use GGPHP\Core\Models\UuidModel;

class ScheduleRepeat extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ScheduleRepeatStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ScheduleId', 'RepeatBy', 'Count', 'Interval', 'ByWeekDay',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define relations schedule
     */
    public function schedule()
    {
        return $this->belongsTo(\GGPHP\YoungAttendance\ShiftSchedule\Models\Schedule::class, 'ScheduleId');
    }

    /**
     * Update byweekday
     * @param string $value
     * @return array
     */
    public function getByWeekDayAttribute($value)
    {
        if (!empty($value)) {
            return explode(',', $value);
        }

        return $value = null;
    }

}
