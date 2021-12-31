<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Models;

use GGPHP\Core\Models\UuidModel;

class ScheduleException extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ScheduleExceptionStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Date', 'ShiftId', 'ScheduleId',
    ];

    protected $dateTimeFields = [
        'Date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'Date' => 'datetime',
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
}
