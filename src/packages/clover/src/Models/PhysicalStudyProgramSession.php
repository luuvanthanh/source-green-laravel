<?php

namespace GGPHP\Clover\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class PhysicalStudyProgramSession extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;
    public $timestamps = false;
    /**
     * Declare the table name
     */
    protected $table = 'physical.PhysicalStudyProgramSessions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'PhysicalStudyProgramId', 'WeekIndex', 'Name', 'Content', 'Target', 'IsUsed'
    ];
}
