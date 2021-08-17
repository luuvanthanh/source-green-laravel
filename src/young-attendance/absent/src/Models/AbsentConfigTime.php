<?php

namespace GGPHP\YoungAttendance\Absent\Models;

use GGPHP\Core\Models\UuidModel;

class AbsentConfigTime extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AbsentConfigTimes';

    protected $fillable = [
        'From', 'To', 'AdvanceNotice'
    ];
}
