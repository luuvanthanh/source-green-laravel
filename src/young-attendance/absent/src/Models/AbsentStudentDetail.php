<?php

namespace GGPHP\YoungAttendance\Absent\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class AbsentStudentDetail extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    protected $table = 'AbsentStudentDetails';

    protected $fillable = [
        'AbsentStudentId', 'Date', 'IsRefunds',
    ];
}
