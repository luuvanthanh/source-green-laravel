<?php

namespace GGPHP\ShiftSchedule\Models;

use GGPHP\Core\Models\CoreModel;

class ScheduleRepeat extends CoreModel
{

    /**
     * Declare the table name
     */
    protected $table = 'schedule_repeats';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'schedule_id', 'repeat_by', 'count', 'interval', 'by_week_day',
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
        return $this->belongsTo(\GGPHP\ShiftSchedule\Models\Schedule::class, 'schedule_id');
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
