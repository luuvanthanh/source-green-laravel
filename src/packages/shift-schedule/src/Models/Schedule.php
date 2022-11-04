<?php

namespace GGPHP\ShiftSchedule\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class Schedule extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Schedules';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'ShiftId', 'StartDate', 'EndDate',
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
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    /**
     * Define relations schedule repeat
     */
    public function scheduleRepeat()
    {
        return $this->hasOne(\GGPHP\ShiftSchedule\Models\ScheduleRepeat::class, 'ScheduleId');
    }

    /**
     * Define relations schedule exception
     */
    public function scheduleException()
    {
        return $this->hasMany(\GGPHP\ShiftSchedule\Models\ScheduleException::class, 'ScheduleId');
    }

    /**
     * Define relations shift
     */
    public function shift()
    {
        return $this->hasOne(\GGPHP\ShiftSchedule\Models\Shift::class, 'Id', 'ShiftId');
    }
}
