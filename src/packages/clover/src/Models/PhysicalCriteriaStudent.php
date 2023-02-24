<?php

namespace GGPHP\Clover\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\ChargeOldStudent;

class PhysicalCriteriaStudent extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'physical.PhysicalCriteriaStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StudentId', 'SchoolYearId', 'ClassId', 'AssessmentPeriodId','Status','ApprovedEmployeeId','RejectedEmployeeId','SentEmployeeId','ApprovedDate','SentDate','ExtraProperties','ConcurrencyStamp',
    ];
}
