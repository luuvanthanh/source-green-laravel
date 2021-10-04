<?php

namespace GGPHP\YoungAttendance\Absent\Models;

use GGPHP\Core\Models\UuidModel;

class AbsentStudentDetail extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AbsentStudentDetails';

    protected $fillable = [
        'AbsentStudentId', 'Date', 'IsRefunds',
    ];

}
