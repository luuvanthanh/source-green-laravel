<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Models;

use GGPHP\Core\Models\UuidModel;

class ShiftDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ShiftDetailStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ShiftId', 'StartTime', 'EndTime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
