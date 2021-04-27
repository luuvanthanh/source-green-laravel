<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Models;

use GGPHP\Core\Models\UuidModel;

class Schedule extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ScheduleStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StudentId', 'ShiftId', 'StartDate', 'EndDate',
    ];

    protected $dateTimeFields = [
        'StartDate',
        'EndDate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'StartDate' => 'datetime',
        'EndDate' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define relations employee
     */
    public function student()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Student::class, 'StudentId');
    }

    /**
     * Define relations schedule repeat
     */
    public function scheduleRepeat()
    {
        return $this->hasOne(\GGPHP\YoungAttendance\ShiftSchedule\Models\ScheduleRepeat::class, 'ScheduleId');
    }

    /**
     * Define relations schedule exception
     */
    public function scheduleException()
    {
        return $this->hasMany(\GGPHP\YoungAttendance\ShiftSchedule\Models\ScheduleException::class, 'ScheduleId');
    }

    /**
     * Define relations shift
     */
    public function shift()
    {
        return $this->hasOne(\GGPHP\YoungAttendance\ShiftSchedule\Models\Shift::class, 'Id', 'ShiftId');
    }
}
