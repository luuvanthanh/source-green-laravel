<?php

namespace GGPHP\ShiftSchedule\Models;

use GGPHP\Core\Models\UuidModel;

class ScheduleException extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'schedule_exceptions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date', 'shift_id', 'schedule_id',
    ];

    protected $dateTimeFields = [
        'date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'date' => 'datetime',
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

}
