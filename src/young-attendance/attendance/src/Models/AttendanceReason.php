<?php

namespace GGPHP\Attendance\Models;

use GGPHP\Core\Models\UuidModel;

class AttendanceReason extends UuidModel
{

    /**
     * Declare the table name
     */
    protected $table = 'AttendanceReasons';

    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Content',
    ];

}
