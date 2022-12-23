<?php

namespace GGPHP\YoungAttendance\Absent\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class AbsentConfigTime extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    protected $table = 'AbsentConfigTimes';

    protected $fillable = [
        'From', 'To', 'AdvanceNotice'
    ];
}
