<?php

namespace GGPHP\InterviewManager\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class InterviewerListEmployee extends UuidModel
{
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'InterviewListEmployees';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'InterviewListId',
        'EmployeeId',
    ];
}
